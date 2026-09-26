package moodle_pensamento.moodle.aviso.dto;

import jakarta.validation.constraints.NotBlank;

public record AvisoRequestDTO(
        @NotBlank
        String titulo,

        @NotBlank
        String conteudo
) {
}
