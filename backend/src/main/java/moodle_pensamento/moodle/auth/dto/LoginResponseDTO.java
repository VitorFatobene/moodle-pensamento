package moodle_pensamento.moodle.auth.dto;

import moodle_pensamento.moodle.usuario.TipoUsuario;

public record LoginResponseDTO(
        String token,
        String tipo,
        Long usuarioId,
        String nome,
        String email,
        TipoUsuario tipoUsuario
) {
}
