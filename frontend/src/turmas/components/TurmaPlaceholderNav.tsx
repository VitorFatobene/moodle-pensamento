import { NavLink, useParams } from 'react-router-dom'

export function TurmaPlaceholderNav() {
  const { turmaId } = useParams()
  const basePath = `/professor/turmas/${turmaId ?? ''}`

  return (
    <nav className="turma-tabs" aria-label="Navegação da turma">
      <NavLink end to={basePath}>
        Visão geral
      </NavLink>
      <NavLink to={`${basePath}/avisos`}>Avisos</NavLink>
      <NavLink to={`${basePath}/alunos`}>Alunos</NavLink>
      <NavLink to={`${basePath}/solicitacoes`}>Solicitações</NavLink>
      <NavLink to={`${basePath}/atividades`}>Atividades</NavLink>
    </nav>
  )
}
