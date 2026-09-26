package moodle_pensamento.moodle.turma.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TurmaRequestDTO(
        @NotBlank
        String nome,

        String descricao,

        @NotNull
        Long professorId
) {
}
