package moodle_pensamento.moodle.entrega.dto;

import jakarta.validation.constraints.NotNull;

public record EntregaAtividadeRequestDTO(
        @NotNull
        Long alunoId,

        String linkEntrega
) {
}
