package moodle_pensamento.moodle.solicitacao.dto;

import jakarta.validation.constraints.NotNull;

public record SolicitacaoEntradaRequestDTO(
        @NotNull
        Long alunoId,

        @NotNull
        Long turmaId
) {
}
