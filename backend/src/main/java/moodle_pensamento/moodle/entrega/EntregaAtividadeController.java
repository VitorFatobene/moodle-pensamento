package moodle_pensamento.moodle.entrega;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.entrega.dto.EntregaAtividadeRequestDTO;
import moodle_pensamento.moodle.entrega.dto.EntregaAtividadeResponseDTO;
import moodle_pensamento.moodle.entrega.dto.NotaEntregaRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EntregaAtividadeController {

    private final EntregaAtividadeService entregaAtividadeService;

    @PostMapping("/atividades/{atividadeId}/entregas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<EntregaAtividadeResponseDTO> criarOuAtualizar(
            @PathVariable Long atividadeId,
            @Valid @RequestBody EntregaAtividadeRequestDTO dto
    ) {
        return ResponseEntity.ok(entregaAtividadeService.criarOuAtualizar(atividadeId, dto));
    }

    @PatchMapping("/atividades/{atividadeId}/concluir")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<EntregaAtividadeResponseDTO> concluir(@PathVariable Long atividadeId) {
        return ResponseEntity.ok(entregaAtividadeService.concluir(atividadeId));
    }

    @GetMapping("/atividades/{atividadeId}/entregas")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<EntregaAtividadeResponseDTO>> listarPorAtividade(
            @PathVariable Long atividadeId
    ) {
        return ResponseEntity.ok(entregaAtividadeService.listarPorAtividade(atividadeId));
    }

    @GetMapping("/minhas-entregas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<EntregaAtividadeResponseDTO>> listarMinhasEntregas() {
        return ResponseEntity.ok(entregaAtividadeService.listarMinhasEntregas());
    }

    @PatchMapping("/entregas/{entregaId}/nota")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<EntregaAtividadeResponseDTO> atribuirNota(
            @PathVariable Long entregaId,
            @Valid @RequestBody NotaEntregaRequestDTO dto
    ) {
        return ResponseEntity.ok(entregaAtividadeService.atribuirNota(entregaId, dto));
    }
}
