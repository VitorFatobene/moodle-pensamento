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
import moodle_pensamento.moodle.turma.Turma;
import moodle_pensamento.moodle.usuario.StatusUsuario;
import moodle_pensamento.moodle.usuario.TipoUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import moodle_pensamento.moodle.usuario.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EntregaAtividadeService {

    private final EntregaAtividadeRepository entregaAtividadeRepository;
    private final AtividadeRepository atividadeRepository;
    private final UsuarioRepository usuarioRepository;
    private final MatriculaRepository matriculaRepository;

    public EntregaAtividadeResponseDTO criarOuAtualizar(Long atividadeId, EntregaAtividadeRequestDTO dto) {
        Atividade atividade = buscarAtividadeAtiva(atividadeId);
        Usuario aluno = buscarAlunoValido(dto.alunoId());
        validarMatriculaAtiva(aluno, atividade.getTurma());

        EntregaAtividade entrega = entregaAtividadeRepository
                .findByAtividadeIdAndAlunoId(atividadeId, dto.alunoId())
                .orElseGet(() -> criarEntregaPendente(atividade, aluno));

        entrega.setLinkEntrega(dto.linkEntrega());

        EntregaAtividade entregaSalva = entregaAtividadeRepository.save(entrega);
        return toResponseDTO(entregaSalva);
    }

    public EntregaAtividadeResponseDTO concluir(Long atividadeId, Long alunoId) {
        EntregaAtividade entrega = entregaAtividadeRepository
                .findByAtividadeIdAndAlunoId(atividadeId, alunoId)
                .orElseGet(() -> criarEntregaPendenteParaAluno(atividadeId, alunoId));

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
        buscarAtividadeAtiva(atividadeId);

        return entregaAtividadeRepository.findAllByAtividadeId(atividadeId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EntregaAtividadeResponseDTO> listarPorAluno(Long alunoId) {
        buscarAlunoValido(alunoId);

        return entregaAtividadeRepository.findAllByAlunoId(alunoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public EntregaAtividadeResponseDTO atribuirNota(
            Long entregaId,
            Long professorId,
            NotaEntregaRequestDTO dto
    ) {
        EntregaAtividade entrega = entregaAtividadeRepository.findById(entregaId)
                .orElseThrow(() -> new EntregaNaoEncontradaException(entregaId));

        Atividade atividade = entrega.getAtividade();
        buscarProfessorComPermissao(professorId, atividade.getTurma());

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

    private EntregaAtividade criarEntregaPendenteParaAluno(Long atividadeId, Long alunoId) {
        Atividade atividade = buscarAtividadeAtiva(atividadeId);
        Usuario aluno = buscarAlunoValido(alunoId);
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

    private Usuario buscarAlunoValido(Long alunoId) {
        Usuario aluno = usuarioRepository.findByIdAndStatus(alunoId, StatusUsuario.ATIVO)
                .orElseThrow(() -> new AlunoInvalidoException(alunoId));

        if (aluno.getTipoUsuario() != TipoUsuario.ALUNO) {
            throw new AlunoInvalidoException(alunoId);
        }

        return aluno;
    }

    private Usuario buscarProfessorComPermissao(Long professorId, Turma turma) {
        Usuario professor = usuarioRepository.findByIdAndStatus(professorId, StatusUsuario.ATIVO)
                .orElseThrow(() -> new ProfessorSemPermissaoException(professorId, turma.getId()));

        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR) {
            throw new ProfessorSemPermissaoException(professorId, turma.getId());
        }

        if (!turma.getProfessor().getId().equals(professor.getId())) {
            throw new ProfessorSemPermissaoException(professorId, turma.getId());
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
