import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth/pages/LoginPage'
import { AlunoHomePage } from '../pages/AlunoHomePage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfessorHomePage } from '../pages/ProfessorHomePage'
import { AlunoTurmaAvisosPage } from '../avisos/pages/AlunoTurmaAvisosPage'
import { AlunoAtividadeDetalhePage } from '../atividades/pages/AlunoAtividadeDetalhePage'
import { AlunoTurmaAtividadesPage } from '../atividades/pages/AlunoTurmaAtividadesPage'
import { ProfessorAtividadeEntregasPage } from '../entregas/pages/ProfessorAtividadeEntregasPage'
import { AlunoSolicitacoesPage } from '../solicitacoes/pages/AlunoSolicitacoesPage'
import { AlunoTurmaDetalhePage } from '../turmas/pages/AlunoTurmaDetalhePage'
import { AlunoTurmasPage } from '../turmas/pages/AlunoTurmasPage'
import { ProfessorTurmaAlunosPage } from '../turmas/pages/ProfessorTurmaAlunosPage'
import { ProfessorTurmaAtividadesPage } from '../turmas/pages/ProfessorTurmaAtividadesPage'
import { ProfessorTurmaAvisosPage } from '../turmas/pages/ProfessorTurmaAvisosPage'
import { ProfessorTurmaDetalhePage } from '../turmas/pages/ProfessorTurmaDetalhePage'
import { ProfessorTurmaSolicitacoesPage } from '../turmas/pages/ProfessorTurmaSolicitacoesPage'
import { ProfessorTurmasPage } from '../turmas/pages/ProfessorTurmasPage'
import { PrivateRoute } from './PrivateRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/professor"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorTurmasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorTurmaDetalhePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/avisos"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorTurmaAvisosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/alunos"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorTurmaAlunosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/solicitacoes"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorTurmaSolicitacoesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/atividades"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorTurmaAtividadesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/atividades/:atividadeId/entregas"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <ProfessorAtividadeEntregasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/solicitacoes"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoSolicitacoesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoTurmasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoTurmaDetalhePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId/avisos"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoTurmaAvisosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId/atividades"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoTurmaAtividadesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId/atividades/:atividadeId"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <AlunoAtividadeDetalhePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
