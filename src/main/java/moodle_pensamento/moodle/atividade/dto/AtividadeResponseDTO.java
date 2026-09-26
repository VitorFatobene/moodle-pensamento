package moodle_pensamento.moodle.atividade.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import moodle_pensamento.moodle.atividade.StatusAtividade;

public record AtividadeResponseDTO(
        Long id,
        String titulo,
        String descricao,
        LocalDateTime dataCriacao,
        LocalDateTime dataLimite,
        BigDecimal notaMaxima,
        Long turmaId,
        String turmaNome,
        Long professorId,
        String professorNome,
        StatusAtividade status
) {
}
