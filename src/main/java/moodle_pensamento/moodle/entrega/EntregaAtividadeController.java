package moodle_pensamento.moodle.entrega;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.entrega.dto.EntregaAtividadeRequestDTO;
import moodle_pensamento.moodle.entrega.dto.EntregaAtividadeResponseDTO;
import moodle_pensamento.moodle.entrega.dto.NotaEntregaRequestDTO;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<EntregaAtividadeResponseDTO> criarOuAtualizar(
            @PathVariable Long atividadeId,
            @Valid @RequestBody EntregaAtividadeRequestDTO dto
    ) {
        return ResponseEntity.ok(entregaAtividadeService.criarOuAtualizar(atividadeId, dto));
    }

    @PatchMapping("/atividades/{atividadeId}/alunos/{alunoId}/concluir")
    public ResponseEntity<EntregaAtividadeResponseDTO> concluir(
            @PathVariable Long atividadeId,
            @PathVariable Long alunoId
    ) {
        return ResponseEntity.ok(entregaAtividadeService.concluir(atividadeId, alunoId));
    }

    @GetMapping("/atividades/{atividadeId}/entregas")
    public ResponseEntity<List<EntregaAtividadeResponseDTO>> listarPorAtividade(
            @PathVariable Long atividadeId
    ) {
        return ResponseEntity.ok(entregaAtividadeService.listarPorAtividade(atividadeId));
    }

    @GetMapping("/usuarios/{alunoId}/entregas")
    public ResponseEntity<List<EntregaAtividadeResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(entregaAtividadeService.listarPorAluno(alunoId));
    }

    @PatchMapping("/entregas/{entregaId}/nota/{professorId}")
    public ResponseEntity<EntregaAtividadeResponseDTO> atribuirNota(
            @PathVariable Long entregaId,
            @PathVariable Long professorId,
            @Valid @RequestBody NotaEntregaRequestDTO dto
    ) {
        return ResponseEntity.ok(entregaAtividadeService.atribuirNota(entregaId, professorId, dto));
    }
}
