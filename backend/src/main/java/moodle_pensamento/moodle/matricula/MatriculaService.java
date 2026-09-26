package moodle_pensamento.moodle.matricula;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.matricula.dto.MatriculaRequestDTO;
import moodle_pensamento.moodle.matricula.dto.MatriculaResponseDTO;
import moodle_pensamento.moodle.matricula.exception.AlunoInvalidoException;
import moodle_pensamento.moodle.matricula.exception.AlunoJaMatriculadoException;
import moodle_pensamento.moodle.matricula.exception.MatriculaNaoEncontradaException;
import moodle_pensamento.moodle.security.UsuarioAutenticadoService;
import moodle_pensamento.moodle.turma.StatusTurma;
import moodle_pensamento.moodle.turma.Turma;
import moodle_pensamento.moodle.turma.TurmaRepository;
import moodle_pensamento.moodle.turma.exception.TurmaNaoEncontradaException;
import moodle_pensamento.moodle.usuario.StatusUsuario;
import moodle_pensamento.moodle.usuario.TipoUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import moodle_pensamento.moodle.usuario.UsuarioRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public MatriculaResponseDTO criar(MatriculaRequestDTO dto) {
        Usuario aluno = buscarAlunoValido(dto.alunoId());
        Turma turma = buscarTurmaAtiva(dto.turmaId());
        validarProfessorAutenticadoResponsavel(turma);

        return matriculaRepository.findByAlunoIdAndTurmaId(dto.alunoId(), dto.turmaId())
                .map(matricula -> reativarOuFalhar(matricula, dto.alunoId(), dto.turmaId()))
                .orElseGet(() -> criarNovaMatricula(aluno, turma));
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponseDTO> listarPorTurma(Long turmaId) {
        Turma turma = buscarTurmaAtiva(turmaId);
        validarProfessorAutenticadoResponsavel(turma);

        return matriculaRepository.findAllByTurmaIdAndStatus(turmaId, StatusMatricula.ATIVA)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponseDTO> listarPorAluno(Long alunoId) {
        buscarAlunoValido(alunoId);

        return matriculaRepository.findAllByAlunoIdAndStatus(alunoId, StatusMatricula.ATIVA)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponseDTO> listarMinhasTurmas() {
        Usuario aluno = usuarioAutenticadoService.get();

        if (aluno.getTipoUsuario() != TipoUsuario.ALUNO) {
            throw new AlunoInvalidoException(aluno.getId());
        }

        return listarPorAluno(aluno.getId());
    }

    public void excluir(Long turmaId, Long alunoId) {
        Turma turma = buscarTurmaAtiva(turmaId);
        validarProfessorAutenticadoResponsavel(turma);

        Matricula matricula = matriculaRepository.findByAlunoIdAndTurmaIdAndStatus(
                        alunoId,
                        turmaId,
                        StatusMatricula.ATIVA
                )
                .orElseThrow(() -> new MatriculaNaoEncontradaException(turmaId, alunoId));

        matricula.setStatus(StatusMatricula.INATIVA);
        matriculaRepository.save(matricula);
    }

    private Usuario buscarAlunoValido(Long alunoId) {
        Usuario aluno = usuarioRepository.findByIdAndStatus(alunoId, StatusUsuario.ATIVO)
                .orElseThrow(() -> new AlunoInvalidoException(alunoId));

        if (aluno.getTipoUsuario() != TipoUsuario.ALUNO) {
            throw new AlunoInvalidoException(alunoId);
        }

        return aluno;
    }

    private Turma buscarTurmaAtiva(Long turmaId) {
        return turmaRepository.findByIdAndStatus(turmaId, StatusTurma.ATIVA)
                .orElseThrow(() -> new TurmaNaoEncontradaException(turmaId));
    }

    private void validarProfessorAutenticadoResponsavel(Turma turma) {
        Usuario professor = usuarioAutenticadoService.get();

        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR
                || !turma.getProfessor().getId().equals(professor.getId())) {
            throw new AccessDeniedException("Professor não é responsável pela turma");
        }
    }

    private MatriculaResponseDTO reativarOuFalhar(Matricula matricula, Long alunoId, Long turmaId) {
        if (matricula.getStatus() == StatusMatricula.ATIVA) {
            throw new AlunoJaMatriculadoException(alunoId, turmaId);
        }

        matricula.setStatus(StatusMatricula.ATIVA);
        matricula.setDataEntrada(LocalDateTime.now());

        Matricula matriculaSalva = matriculaRepository.save(matricula);
        return toResponseDTO(matriculaSalva);
    }

    private MatriculaResponseDTO criarNovaMatricula(Usuario aluno, Turma turma) {
        Matricula matricula = new Matricula(
                null,
                aluno,
                turma,
                LocalDateTime.now(),
                StatusMatricula.ATIVA
        );

        Matricula matriculaSalva = matriculaRepository.save(matricula);
        return toResponseDTO(matriculaSalva);
    }

    private MatriculaResponseDTO toResponseDTO(Matricula matricula) {
        Usuario aluno = matricula.getAluno();
        Turma turma = matricula.getTurma();

        return new MatriculaResponseDTO(
                matricula.getId(),
                aluno.getId(),
                aluno.getNome(),
                turma.getId(),
                turma.getNome(),
                matricula.getDataEntrada(),
                matricula.getStatus()
        );
    }
}
