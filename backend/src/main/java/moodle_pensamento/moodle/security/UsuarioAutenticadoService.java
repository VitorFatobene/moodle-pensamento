package moodle_pensamento.moodle.security;

import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.usuario.StatusUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import moodle_pensamento.moodle.usuario.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioAutenticadoService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Usuario get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationCredentialsNotFoundException("Usuário não autenticado");
        }

        String email = authentication.getName();

        return usuarioRepository.findByEmail(email)
                .filter(usuario -> usuario.getStatus() == StatusUsuario.ATIVO)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado ou inativo"));
    }
}
