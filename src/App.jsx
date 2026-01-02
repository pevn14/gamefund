function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          GameFund
        </h1>
        <p className="text-gray-600 mb-6">
          Tailwind CSS v4 est configuré ! 🎉
        </p>
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-primary-600 rounded-lg"></div>
          <div className="w-12 h-12 bg-accent-600 rounded-lg"></div>
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export default App
