export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <main className="grid place-items-center h-screen">
            {children}
        </main>
    )
}