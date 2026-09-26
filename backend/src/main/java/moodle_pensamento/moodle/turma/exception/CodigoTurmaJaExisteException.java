package moodle_pensamento.moodle.turma.exception;

public class CodigoTurmaJaExisteException extends RuntimeException {

    public CodigoTurmaJaExisteException(String codigoEntrada) {
        super("Código de turma já existe: " + codigoEntrada);
    }
}
