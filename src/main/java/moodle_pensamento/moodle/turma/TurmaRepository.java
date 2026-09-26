package moodle_pensamento.moodle.turma;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurmaRepository extends JpaRepository<Turma, Long> {

    Optional<Turma> findByIdAndStatus(Long id, StatusTurma status);

    List<Turma> findAllByStatus(StatusTurma status);

    List<Turma> findAllByProfessorIdAndStatus(Long professorId, StatusTurma status);

    boolean existsByCodigoEntrada(String codigoEntrada);

    Optional<Turma> findByCodigoEntradaAndStatus(String codigoEntrada, StatusTurma status);
}
