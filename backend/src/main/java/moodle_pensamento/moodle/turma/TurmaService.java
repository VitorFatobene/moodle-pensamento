package moodle_pensamento.moodle.turma;

import java.security.SecureRandom;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.security.UsuarioAutenticadoService;
import moodle_pensamento.moodle.turma.dto.TurmaRequestDTO;
import moodle_pensamento.moodle.turma.dto.TurmaResponseDTO;
import moodle_pensamento.moodle.turma.exception.CodigoTurmaJaExisteException;
import moodle_pensamento.moodle.turma.exception.ProfessorInvalidoException;
import moodle_pensamento.moodle.turma.exception.TurmaNaoEncontradaException;
import moodle_pensamento.moodle.usuario.TipoUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TurmaService {

    private static final String CARACTERES_CODIGO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int TAMANHO_CODIGO = 6;
    private static final int MAX_TENTATIVAS_GERACAO_CODIGO = 20;

    private final TurmaRepository turmaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;
    private final SecureRandom secureRandom = new SecureRandom();

    public TurmaResponseDTO criar(TurmaRequestDTO dto) {
        Usuario professor = buscarProfessorAutenticado();

        Turma turma = new Turma(
                null,
                dto.nome(),
                dto.descricao(),
                gerarCodigoEntrada(),
                professor,
                StatusTurma.ATIVA
        );

        Turma turmaSalva = turmaRepository.save(turma);
        return toResponseDTO(turmaSalva);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTodas() {
        return turmaRepository.findAllByStatus(StatusTurma.ATIVA)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarPorId(Long id) {
        Turma turma = buscarEntidadeAtivaPorId(id);
        return toResponseDTO(turma);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarPorProfessor(Long professorId) {
        Usuario professor = buscarProfessorAutenticado();

        if (!professor.getId().equals(professorId)) {
            throw new AccessDeniedException("Professor só pode listar as próprias turmas por esta rota");
        }

        return turmaRepository.findAllByProfessorIdAndStatus(professorId, StatusTurma.ATIVA)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public TurmaResponseDTO atualizar(Long id, TurmaRequestDTO dto) {
        Turma turma = buscarEntidadeAtivaPorId(id);
        validarProfessorAutenticadoResponsavel(turma);

        turma.setNome(dto.nome());
        turma.setDescricao(dto.descricao());

        Turma turmaSalva = turmaRepository.save(turma);
        return toResponseDTO(turmaSalva);
    }

    public void excluir(Long id) {
        Turma turma = buscarEntidadeAtivaPorId(id);
        validarProfessorAutenticadoResponsavel(turma);

        turma.setStatus(StatusTurma.INATIVA);
        turmaRepository.save(turma);
    }

    private Turma buscarEntidadeAtivaPorId(Long id) {
        return turmaRepository.findByIdAndStatus(id, StatusTurma.ATIVA)
                .orElseThrow(() -> new TurmaNaoEncontradaException(id));
    }

    private Usuario buscarProfessorAutenticado() {
        Usuario professor = usuarioAutenticadoService.get();

        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR) {
            throw new ProfessorInvalidoException(professor.getId());
        }

        return professor;
    }

    private void validarProfessorAutenticadoResponsavel(Turma turma) {
        Usuario professor = buscarProfessorAutenticado();

        if (!turma.getProfessor().getId().equals(professor.getId())) {
            throw new AccessDeniedException("Professor não é responsável pela turma");
        }
    }

    private String gerarCodigoEntrada() {
        for (int tentativa = 0; tentativa < MAX_TENTATIVAS_GERACAO_CODIGO; tentativa++) {
            String codigo = gerarCodigoAleatorio();

            if (!turmaRepository.existsByCodigoEntrada(codigo)) {
                return codigo;
            }
        }

        throw new CodigoTurmaJaExisteException("não foi possível gerar código único");
    }

    private String gerarCodigoAleatorio() {
        StringBuilder codigo = new StringBuilder(TAMANHO_CODIGO);

        for (int i = 0; i < TAMANHO_CODIGO; i++) {
            int indice = secureRandom.nextInt(CARACTERES_CODIGO.length());
            codigo.append(CARACTERES_CODIGO.charAt(indice));
        }

        return codigo.toString();
    }

    private TurmaResponseDTO toResponseDTO(Turma turma) {
        Usuario professor = turma.getProfessor();

        return new TurmaResponseDTO(
                turma.getId(),
                turma.getNome(),
                turma.getDescricao(),
                turma.getCodigoEntrada(),
                professor.getId(),
                professor.getNome(),
                turma.getStatus()
        );
    }
}
