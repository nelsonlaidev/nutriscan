'use client'

export default function ErrorPage(props: { error: Error }) {
  const { error } = props

  return (
    <div>
      <h2>Error: {error.message}</h2>
    </div>
  )
}
