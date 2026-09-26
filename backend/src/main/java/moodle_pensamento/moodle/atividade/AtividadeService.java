package moodle_pensamento.moodle.atividade;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.atividade.dto.AtividadeRequestDTO;
import moodle_pensamento.moodle.atividade.dto.AtividadeResponseDTO;
import moodle_pensamento.moodle.atividade.exception.AtividadeNaoEncontradaException;
import moodle_pensamento.moodle.atividade.exception.ProfessorSemPermissaoException;
import moodle_pensamento.moodle.matricula.MatriculaRepository;
import moodle_pensamento.moodle.matricula.StatusMatricula;
import moodle_pensamento.moodle.security.UsuarioAutenticadoService;
import moodle_pensamento.moodle.turma.StatusTurma;
import moodle_pensamento.moodle.turma.Turma;
import moodle_pensamento.moodle.turma.TurmaRepository;
import moodle_pensamento.moodle.turma.exception.TurmaNaoEncontradaException;
import moodle_pensamento.moodle.usuario.TipoUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;
    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public AtividadeResponseDTO criar(Long turmaId, AtividadeRequestDTO dto) {
        Turma turma = buscarTurmaAtiva(turmaId);
        Usuario professor = buscarProfessorAutenticadoComPermissao(turma);

        Atividade atividade = new Atividade(
                null,
                dto.titulo(),
                dto.descricao(),
                LocalDateTime.now(),
                dto.dataLimite(),
                dto.notaMaxima(),
                turma,
                professor,
                StatusAtividade.ATIVA
        );

        Atividade atividadeSalva = atividadeRepository.save(atividade);
        return toResponseDTO(atividadeSalva);
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponseDTO> listarPorTurma(Long turmaId) {
        Turma turma = buscarTurmaAtiva(turmaId);
        validarLeituraPermitida(turma);

        return atividadeRepository.findAllByTurmaIdAndStatus(turmaId, StatusAtividade.ATIVA)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AtividadeResponseDTO buscarPorId(Long id) {
        Atividade atividade = buscarAtividadeAtiva(id);
        validarLeituraPermitida(atividade.getTurma());
        return toResponseDTO(atividade);
    }

    public AtividadeResponseDTO atualizar(Long id, AtividadeRequestDTO dto) {
        Atividade atividade = buscarAtividadeAtiva(id);
        buscarProfessorAutenticadoComPermissao(atividade.getTurma());

        atividade.setTitulo(dto.titulo());
        atividade.setDescricao(dto.descricao());
        atividade.setDataLimite(dto.dataLimite());
        atividade.setNotaMaxima(dto.notaMaxima());

        Atividade atividadeSalva = atividadeRepository.save(atividade);
        return toResponseDTO(atividadeSalva);
    }

    public void excluir(Long id) {
        Atividade atividade = buscarAtividadeAtiva(id);
        buscarProfessorAutenticadoComPermissao(atividade.getTurma());

        atividade.setStatus(StatusAtividade.INATIVA);
        atividadeRepository.save(atividade);
    }

    private Atividade buscarAtividadeAtiva(Long id) {
        return atividadeRepository.findByIdAndStatus(id, StatusAtividade.ATIVA)
                .orElseThrow(() -> new AtividadeNaoEncontradaException(id));
    }

    private Turma buscarTurmaAtiva(Long turmaId) {
        return turmaRepository.findByIdAndStatus(turmaId, StatusTurma.ATIVA)
                .orElseThrow(() -> new TurmaNaoEncontradaException(turmaId));
    }

    private Usuario buscarProfessorAutenticadoComPermissao(Turma turma) {
        Usuario professor = usuarioAutenticadoService.get();

        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR) {
            throw new ProfessorSemPermissaoException(professor.getId(), turma.getId());
        }

        validarProfessorResponsavel(professor, turma);
        return professor;
    }

    private void validarProfessorResponsavel(Usuario professor, Turma turma) {
        if (!turma.getProfessor().getId().equals(professor.getId())) {
            throw new ProfessorSemPermissaoException(professor.getId(), turma.getId());
        }
    }

    private void validarLeituraPermitida(Turma turma) {
        Usuario usuario = usuarioAutenticadoService.get();

        if (usuario.getTipoUsuario() == TipoUsuario.PROFESSOR) {
            return;
        }

        boolean matriculado = matriculaRepository.existsByAlunoIdAndTurmaIdAndStatus(
                usuario.getId(),
                turma.getId(),
                StatusMatricula.ATIVA
        );

        if (!matriculado) {
            throw new AccessDeniedException("Aluno não possui matrícula ativa na turma");
        }
    }

    private AtividadeResponseDTO toResponseDTO(Atividade atividade) {
        Turma turma = atividade.getTurma();
        Usuario professor = atividade.getProfessor();

        return new AtividadeResponseDTO(
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getDataCriacao(),
                atividade.getDataLimite(),
                atividade.getNotaMaxima(),
                turma.getId(),
                turma.getNome(),
                professor.getId(),
                professor.getNome(),
                atividade.getStatus()
        );
    }
}
