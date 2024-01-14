import Menu from '../components/Menu'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
	
	<section>
	<Menu />
	{children} 

	</section>

  )
}
