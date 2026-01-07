export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">PharmaFlow System</h1>
        <p className="text-slate-600 mb-8">Pharmaceutical Inventory Management System</p>
        <div className="space-x-4">
          <a 
            href="/auth/login" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </a>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
