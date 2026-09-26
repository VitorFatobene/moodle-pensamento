package moodle_pensamento.moodle.solicitacao.exception;

public class SolicitacaoJaExisteException extends RuntimeException {

    public SolicitacaoJaExisteException(Long alunoId, Long turmaId) {
        super("Já existe solicitação pendente para aluno " + alunoId + " na turma " + turmaId);
    }
}
