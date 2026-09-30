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
import { MainLayout } from '../layout/MainLayout'
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
            <MainLayout>
              <ProfessorHomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorTurmasPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorTurmaDetalhePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/avisos"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorTurmaAvisosPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/alunos"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorTurmaAlunosPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/solicitacoes"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorTurmaSolicitacoesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/atividades"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorTurmaAtividadesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professor/turmas/:turmaId/atividades/:atividadeId/entregas"
        element={
          <PrivateRoute allowedTipoUsuario="PROFESSOR">
            <MainLayout>
              <ProfessorAtividadeEntregasPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoHomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/solicitacoes"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoSolicitacoesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoTurmasPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoTurmaDetalhePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId/avisos"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoTurmaAvisosPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId/atividades"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoTurmaAtividadesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/turmas/:turmaId/atividades/:atividadeId"
        element={
          <PrivateRoute allowedTipoUsuario="ALUNO">
            <MainLayout>
              <AlunoAtividadeDetalhePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
