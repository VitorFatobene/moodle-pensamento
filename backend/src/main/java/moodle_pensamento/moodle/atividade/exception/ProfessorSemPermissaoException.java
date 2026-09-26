package moodle_pensamento.moodle.atividade.exception;

public class ProfessorSemPermissaoException extends RuntimeException {

    public ProfessorSemPermissaoException(Long professorId, Long turmaId) {
        super("Professor " + professorId + " não tem permissão para gerenciar atividades da turma " + turmaId);
    }
}
