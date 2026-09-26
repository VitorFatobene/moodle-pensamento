package moodle_pensamento.moodle.turma.exception;

public class TurmaNaoEncontradaException extends RuntimeException {

    public TurmaNaoEncontradaException(Long id) {
        super("Turma não encontrada com id: " + id);
    }
}
