package moodle_pensamento.moodle.auth;

import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.auth.dto.LoginRequestDTO;
import moodle_pensamento.moodle.auth.dto.LoginResponseDTO;
import moodle_pensamento.moodle.security.JwtService;
import moodle_pensamento.moodle.usuario.StatusUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import moodle_pensamento.moodle.usuario.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .filter(u -> u.getStatus() == StatusUsuario.ATIVO)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado ou inativo"));

        String token = jwtService.gerarToken(usuario);

        return new LoginResponseDTO(
                token,
                "Bearer",
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario()
        );
    }
}
