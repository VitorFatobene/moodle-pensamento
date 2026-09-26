package moodle_pensamento.moodle.aviso.exception;

public class AvisoNaoEncontradoException extends RuntimeException {

    public AvisoNaoEncontradoException(Long id) {
        super("Aviso não encontrado com id: " + id);
    }
}
