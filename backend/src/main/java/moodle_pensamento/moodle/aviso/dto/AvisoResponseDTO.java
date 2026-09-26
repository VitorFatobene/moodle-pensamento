package moodle_pensamento.moodle.aviso.dto;

import java.time.LocalDateTime;
import moodle_pensamento.moodle.aviso.StatusAviso;

public record AvisoResponseDTO(
        Long id,
        String titulo,
        String conteudo,
        Long turmaId,
        String turmaNome,
        Long professorId,
        String professorNome,
        LocalDateTime dataCriacao,
        LocalDateTime dataAtualizacao,
        StatusAviso status
) {
}
