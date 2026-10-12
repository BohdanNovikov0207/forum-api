interface HeaderProps {
  title: string
}

export function Header(props: HeaderProps) {
  const { title } = props
  return (
    <header className="forum-header">
      <h1>{title}</h1>
    </header>
  )
}