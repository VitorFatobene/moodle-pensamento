import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth/pages/LoginPage'
import { AlunoHomePage } from '../pages/AlunoHomePage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfessorHomePage } from '../pages/ProfessorHomePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/professor" element={<ProfessorHomePage />} />
      <Route path="/aluno" element={<AlunoHomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
