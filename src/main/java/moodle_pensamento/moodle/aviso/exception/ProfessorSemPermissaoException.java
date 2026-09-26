package moodle_pensamento.moodle.aviso.exception;

public class ProfessorSemPermissaoException extends RuntimeException {

    public ProfessorSemPermissaoException(Long professorId, Long turmaId) {
        super("Professor " + professorId + " não tem permissão para gerenciar avisos da turma " + turmaId);
    }
}
