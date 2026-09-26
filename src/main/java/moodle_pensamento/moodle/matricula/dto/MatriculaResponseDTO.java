package moodle_pensamento.moodle.matricula.dto;

import java.time.LocalDateTime;
import moodle_pensamento.moodle.matricula.StatusMatricula;

public record MatriculaResponseDTO(
        Long id,
        Long alunoId,
        String alunoNome,
        Long turmaId,
        String turmaNome,
        LocalDateTime dataEntrada,
        StatusMatricula status
) {
}
