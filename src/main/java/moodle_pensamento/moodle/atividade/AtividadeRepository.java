package moodle_pensamento.moodle.atividade;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    List<Atividade> findAllByTurmaIdAndStatus(Long turmaId, StatusAtividade status);

    Optional<Atividade> findByIdAndStatus(Long id, StatusAtividade status);
}
