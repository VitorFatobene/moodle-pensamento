CREATE TABLE IF NOT EXISTS avisos (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP,
    turma_id BIGINT NOT NULL,
    professor_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
);

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS titulo VARCHAR(255) NOT NULL DEFAULT '';

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS conteudo TEXT NOT NULL DEFAULT '';

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS data_atualizacao TIMESTAMP;

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS turma_id BIGINT;

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS professor_id BIGINT;

ALTER TABLE avisos
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ATIVO';

ALTER TABLE avisos
ALTER COLUMN titulo DROP DEFAULT,
ALTER COLUMN conteudo DROP DEFAULT,
ALTER COLUMN data_criacao DROP DEFAULT,
ALTER COLUMN status DROP DEFAULT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_avisos_turma'
    ) THEN
        ALTER TABLE avisos
        ADD CONSTRAINT fk_avisos_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_avisos_professor'
    ) THEN
        ALTER TABLE avisos
        ADD CONSTRAINT fk_avisos_professor
        FOREIGN KEY (professor_id)
        REFERENCES usuarios(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_avisos_status'
    ) THEN
        ALTER TABLE avisos
        ADD CONSTRAINT chk_avisos_status
        CHECK (status IN ('ATIVO', 'INATIVO'));
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS atividades (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_limite TIMESTAMP,
    nota_maxima NUMERIC(5, 2),
    turma_id BIGINT NOT NULL,
    professor_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA'
);

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS titulo VARCHAR(255) NOT NULL DEFAULT '';

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS descricao TEXT NOT NULL DEFAULT '';

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS data_limite TIMESTAMP;

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS nota_maxima NUMERIC(5, 2);

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS turma_id BIGINT;

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS professor_id BIGINT;

ALTER TABLE atividades
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ATIVA';

ALTER TABLE atividades
ALTER COLUMN titulo DROP DEFAULT,
ALTER COLUMN descricao DROP DEFAULT,
ALTER COLUMN data_criacao DROP DEFAULT,
ALTER COLUMN status DROP DEFAULT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_atividades_turma'
    ) THEN
        ALTER TABLE atividades
        ADD CONSTRAINT fk_atividades_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_atividades_professor'
    ) THEN
        ALTER TABLE atividades
        ADD CONSTRAINT fk_atividades_professor
        FOREIGN KEY (professor_id)
        REFERENCES usuarios(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_atividades_status'
    ) THEN
        ALTER TABLE atividades
        ADD CONSTRAINT chk_atividades_status
        CHECK (status IN ('ATIVA', 'INATIVA'));
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS entregas_atividade (
    id BIGSERIAL PRIMARY KEY,
    atividade_id BIGINT NOT NULL,
    aluno_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    link_entrega VARCHAR(255),
    nota NUMERIC(5, 2),
    data_conclusao TIMESTAMP
);

ALTER TABLE entregas_atividade
ADD COLUMN IF NOT EXISTS atividade_id BIGINT;

ALTER TABLE entregas_atividade
ADD COLUMN IF NOT EXISTS aluno_id BIGINT;

ALTER TABLE entregas_atividade
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE';

ALTER TABLE entregas_atividade
ADD COLUMN IF NOT EXISTS link_entrega VARCHAR(255);

ALTER TABLE entregas_atividade
ADD COLUMN IF NOT EXISTS nota NUMERIC(5, 2);

ALTER TABLE entregas_atividade
ADD COLUMN IF NOT EXISTS data_conclusao TIMESTAMP;

ALTER TABLE entregas_atividade
ALTER COLUMN status DROP DEFAULT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_entregas_atividade'
    ) THEN
        ALTER TABLE entregas_atividade
        ADD CONSTRAINT fk_entregas_atividade
        FOREIGN KEY (atividade_id)
        REFERENCES atividades(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_entregas_aluno'
    ) THEN
        ALTER TABLE entregas_atividade
        ADD CONSTRAINT fk_entregas_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES usuarios(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_entrega_atividade_aluno'
    ) THEN
        ALTER TABLE entregas_atividade
        ADD CONSTRAINT uk_entrega_atividade_aluno
        UNIQUE (atividade_id, aluno_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_entregas_status'
    ) THEN
        ALTER TABLE entregas_atividade
        ADD CONSTRAINT chk_entregas_status
        CHECK (status IN ('PENDENTE', 'CONCLUIDA'));
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS solicitacoes_entrada (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    turma_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMP
);

ALTER TABLE solicitacoes_entrada
ADD COLUMN IF NOT EXISTS aluno_id BIGINT;

ALTER TABLE solicitacoes_entrada
ADD COLUMN IF NOT EXISTS turma_id BIGINT;

ALTER TABLE solicitacoes_entrada
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE';

ALTER TABLE solicitacoes_entrada
ADD COLUMN IF NOT EXISTS data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE solicitacoes_entrada
ADD COLUMN IF NOT EXISTS data_resposta TIMESTAMP;

ALTER TABLE solicitacoes_entrada
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN data_solicitacao DROP DEFAULT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_solicitacoes_aluno'
    ) THEN
        ALTER TABLE solicitacoes_entrada
        ADD CONSTRAINT fk_solicitacoes_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES usuarios(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_solicitacoes_turma'
    ) THEN
        ALTER TABLE solicitacoes_entrada
        ADD CONSTRAINT fk_solicitacoes_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_solicitacoes_status'
    ) THEN
        ALTER TABLE solicitacoes_entrada
        ADD CONSTRAINT chk_solicitacoes_status
        CHECK (status IN ('PENDENTE', 'ACEITA', 'RECUSADA'));
    END IF;
END $$;
