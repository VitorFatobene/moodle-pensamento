package moodle_pensamento.moodle.solicitacao.dto;

import java.time.LocalDateTime;
import moodle_pensamento.moodle.solicitacao.StatusSolicitacao;

public record SolicitacaoEntradaResponseDTO(
        Long id,
        Long alunoId,
        String alunoNome,
        Long turmaId,
        String turmaNome,
        StatusSolicitacao status,
        LocalDateTime dataSolicitacao,
        LocalDateTime dataResposta
) {
}
