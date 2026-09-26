package moodle_pensamento.moodle.entrega.exception;

public class EntregaNaoEncontradaException extends RuntimeException {

    public EntregaNaoEncontradaException(Long id) {
        super("Entrega não encontrada com id: " + id);
    }

    public EntregaNaoEncontradaException(Long atividadeId, Long alunoId) {
        super("Entrega não encontrada para atividade " + atividadeId + " e aluno " + alunoId);
    }
}
