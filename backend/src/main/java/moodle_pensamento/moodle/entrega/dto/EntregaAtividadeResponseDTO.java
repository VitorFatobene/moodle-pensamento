package moodle_pensamento.moodle.entrega.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import moodle_pensamento.moodle.entrega.StatusEntrega;

public record EntregaAtividadeResponseDTO(
        Long id,
        Long atividadeId,
        String atividadeTitulo,
        Long alunoId,
        String alunoNome,
        StatusEntrega status,
        String linkEntrega,
        BigDecimal nota,
        LocalDateTime dataConclusao
) {
}
