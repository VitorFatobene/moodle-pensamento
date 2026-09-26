-- Ajustes centralizados para tabelas restantes:
-- - matriculas
-- - solicitacoes_entrada
-- - avisos
-- - atividades
-- - entregas_atividade

ALTER TABLE matriculas
ADD COLUMN IF NOT EXISTS data_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE matriculas
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ATIVA';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_matricula_status'
    ) THEN
        ALTER TABLE matriculas
        ADD CONSTRAINT chk_matricula_status
        CHECK (status IN ('ATIVA', 'INATIVA'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_matriculas_aluno'
    ) THEN
        ALTER TABLE matriculas
        ADD CONSTRAINT fk_matriculas_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES usuarios(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_matriculas_turma'
    ) THEN
        ALTER TABLE matriculas
        ADD CONSTRAINT fk_matriculas_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_matricula_aluno_turma'
    ) THEN
        ALTER TABLE matriculas
        ADD CONSTRAINT uk_matricula_aluno_turma
        UNIQUE (aluno_id, turma_id);
    END IF;
END $$;
