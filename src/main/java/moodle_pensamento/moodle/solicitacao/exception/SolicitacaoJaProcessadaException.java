package moodle_pensamento.moodle.solicitacao.exception;

public class SolicitacaoJaProcessadaException extends RuntimeException {

    public SolicitacaoJaProcessadaException(Long id) {
        super("Solicitação já processada com id: " + id);
    }
}
