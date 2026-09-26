import { Link, useParams } from 'react-router-dom'

export function TurmaPlaceholderNav() {
  const { turmaId } = useParams()
  const basePath = `/professor/turmas/${turmaId ?? ''}`

  return (
    <nav className="turma-tabs" aria-label="Navegação da turma">
      <Link to={basePath}>Visão geral</Link>
      <Link to={`${basePath}/avisos`}>Avisos</Link>
      <Link to={`${basePath}/alunos`}>Alunos</Link>
      <Link to={`${basePath}/solicitacoes`}>Solicitações</Link>
      <Link to={`${basePath}/atividades`}>Atividades</Link>
    </nav>
  )
}
