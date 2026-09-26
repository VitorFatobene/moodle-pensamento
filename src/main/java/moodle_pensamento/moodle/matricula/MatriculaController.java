package moodle_pensamento.moodle.matricula;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.matricula.dto.MatriculaRequestDTO;
import moodle_pensamento.moodle.matricula.dto.MatriculaResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @PostMapping("/turmas/{turmaId}/alunos/{alunoId}")
    public ResponseEntity<MatriculaResponseDTO> criar(
            @PathVariable Long turmaId,
            @PathVariable Long alunoId
    ) {
        MatriculaRequestDTO dto = new MatriculaRequestDTO(alunoId, turmaId);
        MatriculaResponseDTO matricula = matriculaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(matricula);
    }

    @GetMapping("/turmas/{turmaId}/alunos")
    public ResponseEntity<List<MatriculaResponseDTO>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(matriculaService.listarPorTurma(turmaId));
    }

    @GetMapping("/usuarios/{alunoId}/turmas")
    public ResponseEntity<List<MatriculaResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(matriculaService.listarPorAluno(alunoId));
    }

    @DeleteMapping("/turmas/{turmaId}/alunos/{alunoId}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long turmaId,
            @PathVariable Long alunoId
    ) {
        matriculaService.excluir(turmaId, alunoId);
        return ResponseEntity.noContent().build();
    }
}
