package moodle_pensamento.moodle.usuario;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.usuario.dto.UsuarioRequestDTO;
import moodle_pensamento.moodle.usuario.dto.UsuarioResponseDTO;
import moodle_pensamento.moodle.usuario.exception.EmailJaCadastradoException;
import moodle_pensamento.moodle.usuario.exception.UsuarioNaoEncontradoException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new EmailJaCadastradoException(dto.email());
        }

        Usuario usuario = toEntity(dto);
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return toResponseDTO(usuarioSalvo);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAllByStatus(StatusUsuario.ATIVO)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        return toResponseDTO(usuario);
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarEntidadePorId(id);

        if (usuarioRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new EmailJaCadastradoException(dto.email());
        }

        atualizarEntidade(usuario, dto);
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return toResponseDTO(usuarioSalvo);
    }

    public void excluir(Long id) {
        Usuario usuario = buscarEntidadeAtivaPorId(id);

        usuario.setStatus(StatusUsuario.INATIVO);
        usuarioRepository.save(usuario);
    }

    private Usuario buscarEntidadePorId(Long id) {
        return buscarEntidadeAtivaPorId(id);
    }

    private Usuario buscarEntidadeAtivaPorId(Long id) {
        return usuarioRepository.findByIdAndStatus(id, StatusUsuario.ATIVO)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario(),
                usuario.getStatus()
        );
    }

    private Usuario toEntity(UsuarioRequestDTO dto) {
        return new Usuario(
                null,
                dto.nome(),
                dto.email(),
                passwordEncoder.encode(dto.senha()),
                dto.tipoUsuario(),
                StatusUsuario.ATIVO
        );
    }

    private void atualizarEntidade(Usuario usuario, UsuarioRequestDTO dto) {
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setTipoUsuario(dto.tipoUsuario());
    }
}
