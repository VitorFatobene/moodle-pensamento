package moodle_pensamento.moodle.turma.dto;

import jakarta.validation.constraints.NotBlank;

public record TurmaRequestDTO(
        @NotBlank
        String nome,

        String descricao
) {
}
