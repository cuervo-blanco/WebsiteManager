import type { Metadata } from 'next'
import './styles/globals.scss'

export const metadata: Metadata = {
  title: 'Website Manager',
  description: 'A simple website manager application for my clients',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"> 
		<body >{children}</body>
	</html>
  )
}
