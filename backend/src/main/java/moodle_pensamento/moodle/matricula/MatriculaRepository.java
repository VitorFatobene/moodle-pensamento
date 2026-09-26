package moodle_pensamento.moodle.matricula;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    Optional<Matricula> findByIdAndStatus(Long id, StatusMatricula status);

    List<Matricula> findAllByTurmaIdAndStatus(Long turmaId, StatusMatricula status);

    List<Matricula> findAllByAlunoIdAndStatus(Long alunoId, StatusMatricula status);

    Optional<Matricula> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    Optional<Matricula> findByAlunoIdAndTurmaIdAndStatus(
            Long alunoId,
            Long turmaId,
            StatusMatricula status
    );

    boolean existsByAlunoIdAndTurmaIdAndStatus(
            Long alunoId,
            Long turmaId,
            StatusMatricula status
    );
}
