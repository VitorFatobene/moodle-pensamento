package moodle_pensamento.moodle.entrega.exception;

public class EntregaJaConcluidaException extends RuntimeException {

    public EntregaJaConcluidaException(Long entregaId) {
        super("Entrega já concluída com id: " + entregaId);
    }
}
