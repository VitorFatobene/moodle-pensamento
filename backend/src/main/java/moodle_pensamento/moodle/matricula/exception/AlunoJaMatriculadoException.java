package moodle_pensamento.moodle.matricula.exception;

public class AlunoJaMatriculadoException extends RuntimeException {

    public AlunoJaMatriculadoException(Long alunoId, Long turmaId) {
        super("Aluno " + alunoId + " já está matriculado na turma " + turmaId);
    }
}
