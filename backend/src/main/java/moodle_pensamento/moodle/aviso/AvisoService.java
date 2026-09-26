package moodle_pensamento.moodle.aviso;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.aviso.dto.AvisoRequestDTO;
import moodle_pensamento.moodle.aviso.dto.AvisoResponseDTO;
import moodle_pensamento.moodle.aviso.exception.AvisoNaoEncontradoException;
import moodle_pensamento.moodle.aviso.exception.ProfessorSemPermissaoException;
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
public class AvisoService {

    private final AvisoRepository avisoRepository;
    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    public AvisoResponseDTO criar(Long turmaId, AvisoRequestDTO dto) {
        Turma turma = buscarTurmaAtiva(turmaId);
        Usuario professor = buscarProfessorAutenticadoComPermissao(turma);

        Aviso aviso = new Aviso(
                null,
                dto.titulo(),
                dto.conteudo(),
                LocalDateTime.now(),
                null,
                turma,
                professor,
                StatusAviso.ATIVO
        );

        Aviso avisoSalvo = avisoRepository.save(aviso);
        return toResponseDTO(avisoSalvo);
    }

    @Transactional(readOnly = true)
    public List<AvisoResponseDTO> listarPorTurma(Long turmaId) {
        Turma turma = buscarTurmaAtiva(turmaId);
        validarLeituraPermitida(turma);

        return avisoRepository.findAllByTurmaIdAndStatus(turmaId, StatusAviso.ATIVO)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AvisoResponseDTO buscarPorId(Long id) {
        Aviso aviso = buscarAvisoAtivo(id);
        validarLeituraPermitida(aviso.getTurma());
        return toResponseDTO(aviso);
    }

    public AvisoResponseDTO atualizar(Long id, AvisoRequestDTO dto) {
        Aviso aviso = buscarAvisoAtivo(id);
        buscarProfessorAutenticadoComPermissao(aviso.getTurma());

        aviso.setTitulo(dto.titulo());
        aviso.setConteudo(dto.conteudo());
        aviso.setDataAtualizacao(LocalDateTime.now());

        Aviso avisoSalvo = avisoRepository.save(aviso);
        return toResponseDTO(avisoSalvo);
    }

    public void excluir(Long id) {
        Aviso aviso = buscarAvisoAtivo(id);
        buscarProfessorAutenticadoComPermissao(aviso.getTurma());

        aviso.setStatus(StatusAviso.INATIVO);
        avisoRepository.save(aviso);
    }

    private Aviso buscarAvisoAtivo(Long id) {
        return avisoRepository.findByIdAndStatus(id, StatusAviso.ATIVO)
                .orElseThrow(() -> new AvisoNaoEncontradoException(id));
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

    private AvisoResponseDTO toResponseDTO(Aviso aviso) {
        Turma turma = aviso.getTurma();
        Usuario professor = aviso.getProfessor();

        return new AvisoResponseDTO(
                aviso.getId(),
                aviso.getTitulo(),
                aviso.getConteudo(),
                turma.getId(),
                turma.getNome(),
                professor.getId(),
                professor.getNome(),
                aviso.getDataCriacao(),
                aviso.getDataAtualizacao(),
                aviso.getStatus()
        );
    }
}
