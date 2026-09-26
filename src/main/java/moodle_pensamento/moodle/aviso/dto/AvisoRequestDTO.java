package moodle_pensamento.moodle.aviso.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AvisoRequestDTO(
        @NotBlank
        String titulo,

        @NotBlank
        String conteudo,

        @NotNull
        Long professorId
) {
}
