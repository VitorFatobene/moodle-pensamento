package moodle_pensamento.moodle.matricula.dto;

import jakarta.validation.constraints.NotNull;

public record MatriculaRequestDTO(
        @NotNull
        Long alunoId,

        @NotNull
        Long turmaId
) {
}
