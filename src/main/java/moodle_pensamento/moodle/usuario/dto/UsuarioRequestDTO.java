package moodle_pensamento.moodle.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moodle_pensamento.moodle.usuario.TipoUsuario;

public record UsuarioRequestDTO(
        @NotBlank
        String nome,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 6)
        String senha,

        @NotNull
        TipoUsuario tipoUsuario
) {
}
