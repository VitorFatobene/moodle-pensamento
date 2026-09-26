package moodle_pensamento.moodle.security;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.usuario.StatusUsuario;
import moodle_pensamento.moodle.usuario.Usuario;
import moodle_pensamento.moodle.usuario.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .filter(u -> u.getStatus() == StatusUsuario.ATIVO)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado ou inativo"));

        return new User(
                usuario.getEmail(),
                usuario.getSenha(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuario().name()))
        );
    }
}
