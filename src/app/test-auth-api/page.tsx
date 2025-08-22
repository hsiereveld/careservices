'use client'

import { useState } from 'react'
import { signUp, signIn } from '@/lib/auth-client'

export default function TestAuthAPI() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRegister = async () => {
    setLoading(true)
    try {
      const res = await signUp.email({
        email: 'test@example.com',
        password: 'Test123456!',
        name: 'Test User',
      })
      setResult({ success: true, data: res })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const res = await signIn.email({
        email: 'test@example.com',
        password: 'Test123456!',
      })
      setResult({ success: true, data: res })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Auth API</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testRegister}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mr-4"
        >
          {loading ? 'Loading...' : 'Test Register'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test Login'}
        </button>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}