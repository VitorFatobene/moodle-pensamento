package moodle_pensamento.moodle.entrega;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.atividade.Atividade;
import moodle_pensamento.moodle.atividade.AtividadeRepository;
import moodle_pensamento.moodle.atividade.StatusAtividade;
import moodle_pensamento.moodle.atividade.exception.AtividadeNaoEncontradaException;
import moodle_pensamento.moodle.atividade.exception.ProfessorSemPermissaoException;
import moodle_pensamento.moodle.entrega.dto.EntregaAtividadeRequestDTO;
import moodle_pensamento.moodle.entrega.dto.EntregaAtividadeResponseDTO;
import moodle_pensamento.moodle.entrega.dto.NotaEntregaRequestDTO;
import moodle_pensamento.moodle.entrega.exception.AlunoSemMatriculaException;
import moodle_pensamento.moodle.entrega.exception.EntregaJaConcluidaException;
import moodle_pensamento.moodle.entrega.exception.EntregaNaoEncontradaException;
import moodle_pensamento.moodle.matricula.MatriculaRepository;
import moodle_pensamento.moodle.matricula.StatusMatricula;
import moodle_pensamento.moodle.matricula.exception.AlunoInvalidoException;
import moodle_pensamento.moodle.security.UsuarioAutenticadoService;
import moodle_pensamento.moodle.turma.Turma;
import moodle_pensamento.moodle.usuario.TipoUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EntregaAtividadeService {

    private final EntregaAtividadeRepository entregaAtividadeRepository;
    private final AtividadeRepository atividadeRepository;
    private final MatriculaRepository matriculaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public EntregaAtividadeResponseDTO criarOuAtualizar(Long atividadeId, EntregaAtividadeRequestDTO dto) {
        Atividade atividade = buscarAtividadeAtiva(atividadeId);
        Usuario aluno = buscarAlunoAutenticado();
        validarMatriculaAtiva(aluno, atividade.getTurma());

        EntregaAtividade entrega = entregaAtividadeRepository
                .findByAtividadeIdAndAlunoId(atividadeId, aluno.getId())
                .orElseGet(() -> criarEntregaPendente(atividade, aluno));

        entrega.setLinkEntrega(dto.linkEntrega());

        EntregaAtividade entregaSalva = entregaAtividadeRepository.save(entrega);
        return toResponseDTO(entregaSalva);
    }

    public EntregaAtividadeResponseDTO concluir(Long atividadeId) {
        Usuario aluno = buscarAlunoAutenticado();

        EntregaAtividade entrega = entregaAtividadeRepository
                .findByAtividadeIdAndAlunoId(atividadeId, aluno.getId())
                .orElseGet(() -> criarEntregaPendenteParaAluno(atividadeId, aluno));

        if (entrega.getStatus() == StatusEntrega.CONCLUIDA) {
            throw new EntregaJaConcluidaException(entrega.getId());
        }

        entrega.setStatus(StatusEntrega.CONCLUIDA);
        entrega.setDataConclusao(LocalDateTime.now());

        EntregaAtividade entregaSalva = entregaAtividadeRepository.save(entrega);
        return toResponseDTO(entregaSalva);
    }

    @Transactional(readOnly = true)
    public List<EntregaAtividadeResponseDTO> listarPorAtividade(Long atividadeId) {
        Atividade atividade = buscarAtividadeAtiva(atividadeId);
        buscarProfessorAutenticadoComPermissao(atividade.getTurma());

        return entregaAtividadeRepository.findAllByAtividadeId(atividadeId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EntregaAtividadeResponseDTO> listarMinhasEntregas() {
        Usuario aluno = buscarAlunoAutenticado();

        return entregaAtividadeRepository.findAllByAlunoId(aluno.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public EntregaAtividadeResponseDTO atribuirNota(
            Long entregaId,
            NotaEntregaRequestDTO dto
    ) {
        EntregaAtividade entrega = entregaAtividadeRepository.findById(entregaId)
                .orElseThrow(() -> new EntregaNaoEncontradaException(entregaId));

        Atividade atividade = entrega.getAtividade();
        buscarProfessorAutenticadoComPermissao(atividade.getTurma());

        BigDecimal notaMaxima = atividade.getNotaMaxima();

        if (dto.nota().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Nota não pode ser negativa");
        }

        if (notaMaxima != null && dto.nota().compareTo(notaMaxima) > 0) {
            throw new IllegalArgumentException("Nota não pode ser maior que a nota máxima da atividade");
        }

        entrega.setNota(dto.nota());

        EntregaAtividade entregaSalva = entregaAtividadeRepository.save(entrega);
        return toResponseDTO(entregaSalva);
    }

    private EntregaAtividade criarEntregaPendenteParaAluno(Long atividadeId, Usuario aluno) {
        Atividade atividade = buscarAtividadeAtiva(atividadeId);
        validarMatriculaAtiva(aluno, atividade.getTurma());

        return criarEntregaPendente(atividade, aluno);
    }

    private EntregaAtividade criarEntregaPendente(Atividade atividade, Usuario aluno) {
        return new EntregaAtividade(
                null,
                atividade,
                aluno,
                StatusEntrega.PENDENTE,
                null,
                null,
                null
        );
    }

    private Atividade buscarAtividadeAtiva(Long atividadeId) {
        return atividadeRepository.findByIdAndStatus(atividadeId, StatusAtividade.ATIVA)
                .orElseThrow(() -> new AtividadeNaoEncontradaException(atividadeId));
    }

    private Usuario buscarAlunoAutenticado() {
        Usuario aluno = usuarioAutenticadoService.get();

        if (aluno.getTipoUsuario() != TipoUsuario.ALUNO) {
            throw new AlunoInvalidoException(aluno.getId());
        }

        return aluno;
    }

    private Usuario buscarProfessorAutenticadoComPermissao(Turma turma) {
        Usuario professor = usuarioAutenticadoService.get();

        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR) {
            throw new ProfessorSemPermissaoException(professor.getId(), turma.getId());
        }

        if (!turma.getProfessor().getId().equals(professor.getId())) {
            throw new ProfessorSemPermissaoException(professor.getId(), turma.getId());
        }

        return professor;
    }

    private void validarMatriculaAtiva(Usuario aluno, Turma turma) {
        boolean alunoMatriculado = matriculaRepository.existsByAlunoIdAndTurmaIdAndStatus(
                aluno.getId(),
                turma.getId(),
                StatusMatricula.ATIVA
        );

        if (!alunoMatriculado) {
            throw new AlunoSemMatriculaException(aluno.getId(), turma.getId());
        }
    }

    private EntregaAtividadeResponseDTO toResponseDTO(EntregaAtividade entrega) {
        Atividade atividade = entrega.getAtividade();
        Usuario aluno = entrega.getAluno();

        return new EntregaAtividadeResponseDTO(
                entrega.getId(),
                atividade.getId(),
                atividade.getTitulo(),
                aluno.getId(),
                aluno.getNome(),
                entrega.getStatus(),
                entrega.getLinkEntrega(),
                entrega.getNota(),
                entrega.getDataConclusao()
        );
    }
}
