package moodle_pensamento.moodle.solicitacao.exception;

public class SolicitacaoNaoEncontradaException extends RuntimeException {

    public SolicitacaoNaoEncontradaException(Long id) {
        super("Solicitação não encontrada com id: " + id);
    }
}
