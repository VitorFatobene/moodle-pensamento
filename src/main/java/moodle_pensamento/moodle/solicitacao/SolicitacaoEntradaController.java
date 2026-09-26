package moodle_pensamento.moodle.solicitacao;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.solicitacao.dto.SolicitacaoEntradaResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SolicitacaoEntradaController {

    private final SolicitacaoEntradaService solicitacaoEntradaService;

    @PostMapping("/turmas/{turmaId}/solicitacoes")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<SolicitacaoEntradaResponseDTO> criar(@PathVariable Long turmaId) {
        SolicitacaoEntradaResponseDTO solicitacao = solicitacaoEntradaService.criar(turmaId);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }

    @GetMapping("/turmas/{turmaId}/solicitacoes")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<SolicitacaoEntradaResponseDTO>> listarPendentesPorTurma(
            @PathVariable Long turmaId
    ) {
        return ResponseEntity.ok(solicitacaoEntradaService.listarPendentesPorTurma(turmaId));
    }

    @GetMapping("/minhas-solicitacoes")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<SolicitacaoEntradaResponseDTO>> listarMinhasSolicitacoes() {
        return ResponseEntity.ok(solicitacaoEntradaService.listarMinhasSolicitacoes());
    }

    @PatchMapping("/solicitacoes/{id}/aceitar")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<SolicitacaoEntradaResponseDTO> aceitar(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoEntradaService.aceitar(id));
    }

    @PatchMapping("/solicitacoes/{id}/recusar")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<SolicitacaoEntradaResponseDTO> recusar(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoEntradaService.recusar(id));
    }
}
