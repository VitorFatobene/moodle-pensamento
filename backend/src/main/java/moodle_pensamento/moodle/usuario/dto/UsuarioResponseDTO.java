package moodle_pensamento.moodle.usuario.dto;

import moodle_pensamento.moodle.usuario.StatusUsuario;
import moodle_pensamento.moodle.usuario.TipoUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        TipoUsuario tipoUsuario,
        StatusUsuario status
) {
}
