type PageTitleProps = {
  title: string
}

export function PageTitle(props: PageTitleProps) {
  const { title } = props

  return <h1 className='text-3xl font-semibold'>{title}</h1>
}
