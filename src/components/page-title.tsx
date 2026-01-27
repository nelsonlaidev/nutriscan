type PageTitleProps = {
  title: string
}

function PageTitle(props: PageTitleProps) {
  const { title } = props

  return <h1 className='text-3xl font-semibold'>{title}</h1>
}

export default PageTitle
