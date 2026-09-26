package moodle_pensamento.moodle.matricula.exception;

public class AlunoInvalidoException extends RuntimeException {

    public AlunoInvalidoException(Long alunoId) {
        super("Aluno inválido com id: " + alunoId);
    }
}
