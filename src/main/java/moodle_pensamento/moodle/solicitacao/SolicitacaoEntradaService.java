package moodle_pensamento.moodle.solicitacao;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.matricula.MatriculaRepository;
import moodle_pensamento.moodle.matricula.MatriculaService;
import moodle_pensamento.moodle.matricula.StatusMatricula;
import moodle_pensamento.moodle.matricula.dto.MatriculaRequestDTO;
import moodle_pensamento.moodle.matricula.exception.AlunoInvalidoException;
import moodle_pensamento.moodle.matricula.exception.AlunoJaMatriculadoException;
import moodle_pensamento.moodle.security.UsuarioAutenticadoService;
import moodle_pensamento.moodle.solicitacao.dto.SolicitacaoEntradaResponseDTO;
import moodle_pensamento.moodle.solicitacao.exception.SolicitacaoJaExisteException;
import moodle_pensamento.moodle.solicitacao.exception.SolicitacaoJaProcessadaException;
import moodle_pensamento.moodle.solicitacao.exception.SolicitacaoNaoEncontradaException;
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
public class SolicitacaoEntradaService {

    private final SolicitacaoEntradaRepository solicitacaoEntradaRepository;
    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final MatriculaService matriculaService;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public SolicitacaoEntradaResponseDTO criar(Long turmaId) {
        Usuario aluno = buscarAlunoAutenticado();
        Turma turma = buscarTurmaAtiva(turmaId);

        if (matriculaRepository.existsByAlunoIdAndTurmaIdAndStatus(
                aluno.getId(),
                turmaId,
                StatusMatricula.ATIVA
        )) {
            throw new AlunoJaMatriculadoException(aluno.getId(), turmaId);
        }

        if (solicitacaoEntradaRepository.existsByAlunoIdAndTurmaIdAndStatus(
                aluno.getId(),
                turmaId,
                StatusSolicitacao.PENDENTE
        )) {
            throw new SolicitacaoJaExisteException(aluno.getId(), turmaId);
        }

        SolicitacaoEntrada solicitacao = new SolicitacaoEntrada(
                null,
                aluno,
                turma,
                StatusSolicitacao.PENDENTE,
                LocalDateTime.now(),
                null
        );

        SolicitacaoEntrada solicitacaoSalva = solicitacaoEntradaRepository.save(solicitacao);
        return toResponseDTO(solicitacaoSalva);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoEntradaResponseDTO> listarPendentesPorTurma(Long turmaId) {
        Turma turma = buscarTurmaAtiva(turmaId);
        validarProfessorAutenticadoResponsavel(turma);

        return solicitacaoEntradaRepository.findAllByTurmaIdAndStatus(
                        turmaId,
                        StatusSolicitacao.PENDENTE
                )
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoEntradaResponseDTO> listarMinhasSolicitacoes() {
        Usuario aluno = buscarAlunoAutenticado();

        return solicitacaoEntradaRepository.findAllByAlunoId(aluno.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public SolicitacaoEntradaResponseDTO aceitar(Long id) {
        SolicitacaoEntrada solicitacao = buscarPendenteOuFalhar(id);
        validarProfessorAutenticadoResponsavel(solicitacao.getTurma());

        matriculaService.criar(new MatriculaRequestDTO(
                solicitacao.getAluno().getId(),
                solicitacao.getTurma().getId()
        ));

        solicitacao.setStatus(StatusSolicitacao.ACEITA);
        solicitacao.setDataResposta(LocalDateTime.now());

        SolicitacaoEntrada solicitacaoSalva = solicitacaoEntradaRepository.save(solicitacao);
        return toResponseDTO(solicitacaoSalva);
    }

    public SolicitacaoEntradaResponseDTO recusar(Long id) {
        SolicitacaoEntrada solicitacao = buscarPendenteOuFalhar(id);
        validarProfessorAutenticadoResponsavel(solicitacao.getTurma());

        solicitacao.setStatus(StatusSolicitacao.RECUSADA);
        solicitacao.setDataResposta(LocalDateTime.now());

        SolicitacaoEntrada solicitacaoSalva = solicitacaoEntradaRepository.save(solicitacao);
        return toResponseDTO(solicitacaoSalva);
    }

    private SolicitacaoEntrada buscarPendenteOuFalhar(Long id) {
        return solicitacaoEntradaRepository.findByIdAndStatus(id, StatusSolicitacao.PENDENTE)
                .orElseGet(() -> {
                    SolicitacaoEntrada solicitacao = solicitacaoEntradaRepository.findById(id)
                            .orElseThrow(() -> new SolicitacaoNaoEncontradaException(id));

                    if (solicitacao.getStatus() == StatusSolicitacao.ACEITA
                            || solicitacao.getStatus() == StatusSolicitacao.RECUSADA) {
                        throw new SolicitacaoJaProcessadaException(id);
                    }

                    throw new SolicitacaoNaoEncontradaException(id);
                });
    }

    private Turma buscarTurmaAtiva(Long turmaId) {
        return turmaRepository.findByIdAndStatus(turmaId, StatusTurma.ATIVA)
                .orElseThrow(() -> new TurmaNaoEncontradaException(turmaId));
    }

    private Usuario buscarAlunoAutenticado() {
        Usuario aluno = usuarioAutenticadoService.get();

        if (aluno.getTipoUsuario() != TipoUsuario.ALUNO) {
            throw new AlunoInvalidoException(aluno.getId());
        }

        return aluno;
    }

    private void validarProfessorAutenticadoResponsavel(Turma turma) {
        Usuario professor = usuarioAutenticadoService.get();

        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR
                || !turma.getProfessor().getId().equals(professor.getId())) {
            throw new AccessDeniedException("Professor não é responsável pela turma");
        }
    }

    private SolicitacaoEntradaResponseDTO toResponseDTO(SolicitacaoEntrada solicitacao) {
        Usuario aluno = solicitacao.getAluno();
        Turma turma = solicitacao.getTurma();

        return new SolicitacaoEntradaResponseDTO(
                solicitacao.getId(),
                aluno.getId(),
                aluno.getNome(),
                turma.getId(),
                turma.getNome(),
                solicitacao.getStatus(),
                solicitacao.getDataSolicitacao(),
                solicitacao.getDataResposta()
        );
    }
}
