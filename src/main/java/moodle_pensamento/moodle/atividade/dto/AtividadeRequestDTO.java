package moodle_pensamento.moodle.atividade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AtividadeRequestDTO(
        @NotBlank
        String titulo,

        @NotBlank
        String descricao,

        LocalDateTime dataLimite,

        @Positive
        BigDecimal notaMaxima
) {
}
