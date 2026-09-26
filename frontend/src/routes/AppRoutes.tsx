import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth/pages/LoginPage'
import { AlunoHomePage } from '../pages/AlunoHomePage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfessorHomePage } from '../pages/ProfessorHomePage'
import { ProfessorAtividadeEntregasPage } from '../entregas/pages/ProfessorAtividadeEntregasPage'
import { AlunoTurmaAtividadesPage } from '../turmas/pages/AlunoTurmaAtividadesPage'
import { AlunoTurmaAvisosPage } from '../turmas/pages/AlunoTurmaAvisosPage'
import { AlunoTurmaDetalhePage } from '../turmas/pages/AlunoTurmaDetalhePage'
import { AlunoTurmasPage } from '../turmas/pages/AlunoTurmasPage'
import { ProfessorTurmaAlunosPage } from '../turmas/pages/ProfessorTurmaAlunosPage'
import { ProfessorTurmaAtividadesPage } from '../turmas/pages/ProfessorTurmaAtividadesPage'
import { ProfessorTurmaAvisosPage } from '../turmas/pages/ProfessorTurmaAvisosPage'
import { ProfessorTurmaDetalhePage } from '../turmas/pages/ProfessorTurmaDetalhePage'
import { ProfessorTurmaSolicitacoesPage } from '../turmas/pages/ProfessorTurmaSolicitacoesPage'
import { ProfessorTurmasPage } from '../turmas/pages/ProfessorTurmasPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/professor" element={<ProfessorHomePage />} />
      <Route path="/professor/turmas" element={<ProfessorTurmasPage />} />
      <Route path="/professor/turmas/:turmaId" element={<ProfessorTurmaDetalhePage />} />
      <Route
        path="/professor/turmas/:turmaId/avisos"
        element={<ProfessorTurmaAvisosPage />}
      />
      <Route
        path="/professor/turmas/:turmaId/alunos"
        element={<ProfessorTurmaAlunosPage />}
      />
      <Route
        path="/professor/turmas/:turmaId/solicitacoes"
        element={<ProfessorTurmaSolicitacoesPage />}
      />
      <Route
        path="/professor/turmas/:turmaId/atividades"
        element={<ProfessorTurmaAtividadesPage />}
      />
      <Route
        path="/professor/turmas/:turmaId/atividades/:atividadeId/entregas"
        element={<ProfessorAtividadeEntregasPage />}
      />
      <Route path="/aluno" element={<AlunoHomePage />} />
      <Route path="/aluno/turmas" element={<AlunoTurmasPage />} />
      <Route path="/aluno/turmas/:turmaId" element={<AlunoTurmaDetalhePage />} />
      <Route
        path="/aluno/turmas/:turmaId/avisos"
        element={<AlunoTurmaAvisosPage />}
      />
      <Route
        path="/aluno/turmas/:turmaId/atividades"
        element={<AlunoTurmaAtividadesPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
