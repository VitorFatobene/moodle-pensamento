package moodle_pensamento.moodle.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import moodle_pensamento.moodle.atividade.exception.AtividadeNaoEncontradaException;
import moodle_pensamento.moodle.aviso.exception.AvisoNaoEncontradoException;
import moodle_pensamento.moodle.entrega.exception.AlunoSemMatriculaException;
import moodle_pensamento.moodle.entrega.exception.EntregaJaConcluidaException;
import moodle_pensamento.moodle.entrega.exception.EntregaNaoEncontradaException;
import moodle_pensamento.moodle.matricula.exception.AlunoInvalidoException;
import moodle_pensamento.moodle.matricula.exception.AlunoJaMatriculadoException;
import moodle_pensamento.moodle.matricula.exception.MatriculaNaoEncontradaException;
import moodle_pensamento.moodle.solicitacao.exception.SolicitacaoJaExisteException;
import moodle_pensamento.moodle.solicitacao.exception.SolicitacaoJaProcessadaException;
import moodle_pensamento.moodle.solicitacao.exception.SolicitacaoNaoEncontradaException;
import moodle_pensamento.moodle.turma.exception.CodigoTurmaJaExisteException;
import moodle_pensamento.moodle.turma.exception.ProfessorInvalidoException;
import moodle_pensamento.moodle.turma.exception.TurmaNaoEncontradaException;
import moodle_pensamento.moodle.usuario.exception.EmailJaCadastradoException;
import moodle_pensamento.moodle.usuario.exception.UsuarioNaoEncontradoException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            UsuarioNaoEncontradoException.class,
            TurmaNaoEncontradaException.class,
            MatriculaNaoEncontradaException.class,
            SolicitacaoNaoEncontradaException.class,
            AvisoNaoEncontradoException.class,
            AtividadeNaoEncontradaException.class,
            EntregaNaoEncontradaException.class
    })
    public ResponseEntity<ApiErrorResponse> handleNotFound(RuntimeException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler({
            EmailJaCadastradoException.class,
            CodigoTurmaJaExisteException.class,
            AlunoJaMatriculadoException.class,
            SolicitacaoJaExisteException.class,
            SolicitacaoJaProcessadaException.class,
            EntregaJaConcluidaException.class
    })
    public ResponseEntity<ApiErrorResponse> handleConflict(RuntimeException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                "Conflict",
                "Operação viola uma restrição de integridade dos dados",
                request
        );
    }

    @ExceptionHandler({
            moodle_pensamento.moodle.aviso.exception.ProfessorSemPermissaoException.class,
            moodle_pensamento.moodle.atividade.exception.ProfessorSemPermissaoException.class,
            AlunoSemMatriculaException.class,
            AccessDeniedException.class
    })
    public ResponseEntity<ApiErrorResponse> handleForbidden(RuntimeException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage(), request);
    }

    @ExceptionHandler({
            AlunoInvalidoException.class,
            ProfessorInvalidoException.class,
            IllegalArgumentException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<ApiErrorResponse> handleBadRequest(Exception ex, HttpServletRequest request) {
        String message = ex.getMessage();

        if (ex instanceof MethodArgumentTypeMismatchException mismatch) {
            message = "Valor inválido para o parâmetro '" + mismatch.getName() + "'";
        }

        if (ex instanceof HttpMessageNotReadableException) {
            message = "Corpo da requisição inválido";
        }

        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", message, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, String> fields = new LinkedHashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fields.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ValidationErrorResponse response = new ValidationErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                "Dados inválidos",
                request.getRequestURI(),
                fields
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ValidationErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request
    ) {
        Map<String, String> fields = new LinkedHashMap<>();

        ex.getConstraintViolations().forEach(violation ->
                fields.putIfAbsent(violation.getPropertyPath().toString(), violation.getMessage())
        );

        ValidationErrorResponse response = new ValidationErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                "Dados inválidos",
                request.getRequestURI(),
                fields
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(
            AuthenticationException ex,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Email ou senha inválidos", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Erro inesperado", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Erro interno do servidor", request);
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            String error,
            String message,
            HttpServletRequest request
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(response);
    }
}
