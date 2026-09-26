package moodle_pensamento.moodle.turma.dto;

import moodle_pensamento.moodle.turma.StatusTurma;

public record TurmaResponseDTO(
        Long id,
        String nome,
        String descricao,
        String codigoEntrada,
        Long professorId,
        String professorNome,
        StatusTurma status
) {
}
