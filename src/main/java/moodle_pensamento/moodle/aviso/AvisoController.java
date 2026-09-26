package moodle_pensamento.moodle.aviso;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.aviso.dto.AvisoRequestDTO;
import moodle_pensamento.moodle.aviso.dto.AvisoResponseDTO;
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
public class AvisoController {

    private final AvisoService avisoService;

    @PostMapping("/turmas/{turmaId}/avisos")
    public ResponseEntity<AvisoResponseDTO> criar(
            @PathVariable Long turmaId,
            @Valid @RequestBody AvisoRequestDTO dto
    ) {
        AvisoResponseDTO aviso = avisoService.criar(turmaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(aviso);
    }

    @GetMapping("/turmas/{turmaId}/avisos")
    public ResponseEntity<List<AvisoResponseDTO>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(avisoService.listarPorTurma(turmaId));
    }

    @GetMapping("/avisos/{id}")
    public ResponseEntity<AvisoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(avisoService.buscarPorId(id));
    }

    @PutMapping("/avisos/{id}")
    public ResponseEntity<AvisoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AvisoRequestDTO dto
    ) {
        return ResponseEntity.ok(avisoService.atualizar(id, dto));
    }

    @DeleteMapping("/avisos/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        avisoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
