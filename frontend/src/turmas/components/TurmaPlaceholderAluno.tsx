import { NavLink, useParams } from 'react-router-dom'

export function TurmaPlaceholderAluno() {
  const { turmaId } = useParams()
  const basePath = `/aluno/turmas/${turmaId ?? ''}`

  return (
    <nav className="turma-tabs" aria-label="Navegação da turma">
      <NavLink end to={basePath}>
        Visão geral
      </NavLink>
      <NavLink to={`${basePath}/avisos`}>Avisos</NavLink>
      <NavLink to={`${basePath}/atividades`}>Atividades</NavLink>
    </nav>
  )
}
