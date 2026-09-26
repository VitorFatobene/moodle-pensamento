package moodle_pensamento.moodle.aviso;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {

    List<Aviso> findAllByTurmaIdAndStatus(Long turmaId, StatusAviso status);

    Optional<Aviso> findByIdAndStatus(Long id, StatusAviso status);
}
