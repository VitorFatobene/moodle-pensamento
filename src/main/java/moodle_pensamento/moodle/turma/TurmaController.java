package moodle_pensamento.moodle.turma;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.turma.dto.TurmaRequestDTO;
import moodle_pensamento.moodle.turma.dto.TurmaResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaService turmaService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<TurmaResponseDTO> criar(@Valid @RequestBody TurmaRequestDTO dto) {
        TurmaResponseDTO turma = turmaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(turma);
    }

    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(turmaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @GetMapping("/professor/{professorId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<TurmaResponseDTO>> listarPorProfessor(@PathVariable Long professorId) {
        return ResponseEntity.ok(turmaService.listarPorProfessor(professorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<TurmaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TurmaRequestDTO dto
    ) {
        return ResponseEntity.ok(turmaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        turmaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
