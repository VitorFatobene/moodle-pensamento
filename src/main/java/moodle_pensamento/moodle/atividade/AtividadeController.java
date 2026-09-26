package moodle_pensamento.moodle.atividade;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.atividade.dto.AtividadeRequestDTO;
import moodle_pensamento.moodle.atividade.dto.AtividadeResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AtividadeController {

    private final AtividadeService atividadeService;

    @PostMapping("/turmas/{turmaId}/atividades")
    public ResponseEntity<AtividadeResponseDTO> criar(
            @PathVariable Long turmaId,
            @Valid @RequestBody AtividadeRequestDTO dto
    ) {
        AtividadeResponseDTO atividade = atividadeService.criar(turmaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(atividade);
    }

    @GetMapping("/turmas/{turmaId}/atividades")
    public ResponseEntity<List<AtividadeResponseDTO>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(atividadeService.listarPorTurma(turmaId));
    }

    @GetMapping("/atividades/{id}")
    public ResponseEntity<AtividadeResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(atividadeService.buscarPorId(id));
    }

    @PutMapping("/atividades/{id}")
    public ResponseEntity<AtividadeResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtividadeRequestDTO dto
    ) {
        return ResponseEntity.ok(atividadeService.atualizar(id, dto));
    }

    @DeleteMapping("/atividades/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        atividadeService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
