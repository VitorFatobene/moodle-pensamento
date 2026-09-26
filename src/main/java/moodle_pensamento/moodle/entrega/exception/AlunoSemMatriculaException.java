package moodle_pensamento.moodle.entrega.exception;

public class AlunoSemMatriculaException extends RuntimeException {

    public AlunoSemMatriculaException(Long alunoId, Long turmaId) {
        super("Aluno " + alunoId + " não possui matrícula ativa na turma " + turmaId);
    }
}
