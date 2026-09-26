package moodle_pensamento.moodle.turma.exception;

public class ProfessorInvalidoException extends RuntimeException {

    public ProfessorInvalidoException(Long professorId) {
        super("Professor inválido com id: " + professorId);
    }
}
