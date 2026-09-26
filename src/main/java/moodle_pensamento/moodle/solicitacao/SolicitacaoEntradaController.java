package moodle_pensamento.moodle.solicitacao;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.solicitacao.dto.SolicitacaoEntradaRequestDTO;
import moodle_pensamento.moodle.solicitacao.dto.SolicitacaoEntradaResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SolicitacaoEntradaController {

    private final SolicitacaoEntradaService solicitacaoEntradaService;

    @PostMapping("/turmas/{turmaId}/solicitacoes/{alunoId}")
    public ResponseEntity<SolicitacaoEntradaResponseDTO> criar(
            @PathVariable Long turmaId,
            @PathVariable Long alunoId
    ) {
        SolicitacaoEntradaRequestDTO dto = new SolicitacaoEntradaRequestDTO(alunoId, turmaId);
        SolicitacaoEntradaResponseDTO solicitacao = solicitacaoEntradaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }

    @GetMapping("/turmas/{turmaId}/solicitacoes")
    public ResponseEntity<List<SolicitacaoEntradaResponseDTO>> listarPendentesPorTurma(
            @PathVariable Long turmaId
    ) {
        return ResponseEntity.ok(solicitacaoEntradaService.listarPendentesPorTurma(turmaId));
    }

    @GetMapping("/usuarios/{alunoId}/solicitacoes")
    public ResponseEntity<List<SolicitacaoEntradaResponseDTO>> listarPorAluno(
            @PathVariable Long alunoId
    ) {
        return ResponseEntity.ok(solicitacaoEntradaService.listarPorAluno(alunoId));
    }

    @PatchMapping("/solicitacoes/{id}/aceitar")
    public ResponseEntity<SolicitacaoEntradaResponseDTO> aceitar(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoEntradaService.aceitar(id));
    }

    @PatchMapping("/solicitacoes/{id}/recusar")
    public ResponseEntity<SolicitacaoEntradaResponseDTO> recusar(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoEntradaService.recusar(id));
    }
}
