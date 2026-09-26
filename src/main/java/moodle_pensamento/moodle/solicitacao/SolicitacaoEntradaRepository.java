package moodle_pensamento.moodle.solicitacao;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoEntradaRepository extends JpaRepository<SolicitacaoEntrada, Long> {

    List<SolicitacaoEntrada> findAllByTurmaIdAndStatus(
            Long turmaId,
            StatusSolicitacao status
    );

    List<SolicitacaoEntrada> findAllByAlunoId(Long alunoId);

    Optional<SolicitacaoEntrada> findByIdAndStatus(
            Long id,
            StatusSolicitacao status
    );

    boolean existsByAlunoIdAndTurmaIdAndStatus(
            Long alunoId,
            Long turmaId,
            StatusSolicitacao status
    );
}
