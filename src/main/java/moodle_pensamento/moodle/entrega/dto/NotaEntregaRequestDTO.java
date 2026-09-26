package moodle_pensamento.moodle.entrega.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record NotaEntregaRequestDTO(
        @NotNull
        @DecimalMin("0.0")
        BigDecimal nota
) {
}
