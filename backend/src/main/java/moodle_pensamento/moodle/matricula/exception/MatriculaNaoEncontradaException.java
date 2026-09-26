package moodle_pensamento.moodle.matricula.exception;

public class MatriculaNaoEncontradaException extends RuntimeException {

    public MatriculaNaoEncontradaException(Long turmaId, Long alunoId) {
        super("Matrícula não encontrada para turma " + turmaId + " e aluno " + alunoId);
    }
}
