ALTER TABLE turmas
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ATIVA';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_turma_status'
    ) THEN
        ALTER TABLE turmas
        ADD CONSTRAINT chk_turma_status
        CHECK (status IN ('ATIVA', 'INATIVA'));
    END IF;
END
$$;
