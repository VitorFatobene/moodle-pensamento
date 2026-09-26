package moodle_pensamento.moodle.entrega;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntregaAtividadeRepository extends JpaRepository<EntregaAtividade, Long> {

    @Override
    Optional<EntregaAtividade> findById(Long id);

    Optional<EntregaAtividade> findByAtividadeIdAndAlunoId(Long atividadeId, Long alunoId);

    List<EntregaAtividade> findAllByAtividadeId(Long atividadeId);

    List<EntregaAtividade> findAllByAlunoId(Long alunoId);

    boolean existsByAtividadeIdAndAlunoId(Long atividadeId, Long alunoId);
}
