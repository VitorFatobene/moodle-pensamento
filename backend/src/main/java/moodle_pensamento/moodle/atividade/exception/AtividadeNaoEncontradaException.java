package moodle_pensamento.moodle.atividade.exception;

public class AtividadeNaoEncontradaException extends RuntimeException {

    public AtividadeNaoEncontradaException(Long id) {
        super("Atividade não encontrada com id: " + id);
    }
}
