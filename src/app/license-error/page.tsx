export default function LicenseError() {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">🔒 License Required</h1>
        <p className="mb-6">This commercial version requires a valid license key.</p>
        <a href="https://your.gumroad.link" 
           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Purchase License
        </a>
      </div>
    )
  }
  