'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Settings, CheckCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff, Brain, Zap } from 'lucide-react'

interface PolymerConfig {
  workspaceId: string
  dashboardId: string
  apiKey: string
  embedUrl: string
  apiUrl: string
  scopes: string[]
}

export default function PolymerSetupPage() {
  const [config, setConfig] = useState<PolymerConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [showSecrets, setShowSecrets] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/polymer/config')
      const data = await response.json()
      
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to fetch Polymer config:', error)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/polymer/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test-connection',
          credentials: {
            apiKey: 'demo-key',
            apiUrl: 'https://api.polymersearch.com'
          }
        })
      })
      
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openPolymerPortal = () => {
    window.open('https://app.polymersearch.com', '_blank')
  }

  const openPolymerDocs = () => {
    window.open('https://docs.polymersearch.com', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Polymer AI configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Polymer AI Dashboard Setup
              </h1>
              <p className="text-slate-300 text-lg">
                Configure Polymer AI for intelligent analytics and automated insights
              </p>
            </div>
            <a
              href="/polymer-credentials-guide"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Complete Setup Guide</span>
            </a>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Setup Steps
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="text-white font-medium">Create Polymer AI Account</h3>
                <p className="text-slate-400 text-sm">Sign up for Polymer AI and create your workspace</p>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={openPolymerPortal}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm mr-4"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open Polymer Portal
                  </button>
                  <div className="text-xs text-slate-500">
                    Get: Workspace ID, Dashboard ID, and API Key
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="text-white font-medium">Configure AI Dashboard</h3>
                <p className="text-slate-400 text-sm">Set up your AI-powered analytics dashboard</p>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={openPolymerDocs}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm mr-4"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Documentation
                  </button>
                  <div className="text-xs text-slate-500">
                    Get: Embed URL and API configuration
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="text-white font-medium">Add Environment Variables</h3>
                <p className="text-slate-400 text-sm">Configure the required environment variables</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        {config && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Configuration Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workspace ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={config.workspaceId}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                  />
                  <button
                    onClick={() => copyToClipboard(config.workspaceId, 'workspace')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'workspace' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Dashboard ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={config.dashboardId}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                  />
                  <button
                    onClick={() => copyToClipboard(config.dashboardId, 'dashboard')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'dashboard' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  API Key
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={config.apiKey}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                  />
                  <button
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(config.apiKey, 'api-key')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'api-key' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Embed URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={config.embedUrl}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                  />
                  <button
                    onClick={() => copyToClipboard(config.embedUrl, 'embed-url')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'embed-url' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">🧠 AI Features Quick Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">From Polymer Portal</h3>
              <div className="space-y-1 text-sm">
                <div className="text-slate-300">• Workspace ID → Dashboard Settings</div>
                <div className="text-slate-300">• Dashboard ID → Dashboard URL</div>
                <div className="text-slate-300">• API Key → Account Settings</div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">AI Capabilities</h3>
              <div className="space-y-1 text-sm">
                <div className="text-slate-300">• Automated Insights</div>
                <div className="text-slate-300">• Pattern Recognition</div>
                <div className="text-slate-300">• Predictive Analytics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Required Environment Variables</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Add to your .env.local file:</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="text-slate-300">POLYMER_WORKSPACE_ID=your-workspace-id</div>
                <div className="text-slate-300">POLYMER_DASHBOARD_ID=your-dashboard-id</div>
                <div className="text-slate-300">POLYMER_API_KEY=your-api-key</div>
                <div className="text-slate-300">POLYMER_EMBED_URL=your-embed-url</div>
                <div className="text-slate-300">POLYMER_API_URL=https://api.polymersearch.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Test Connection</h2>
          
          <button
            onClick={testConnection}
            disabled={testing}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Test Polymer AI Connection</span>
              </>
            )}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.success 
                ? 'bg-green-900/20 border border-green-500/20' 
                : 'bg-red-900/20 border border-red-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${
                  testResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResult.message}
                </span>
              </div>
              {testResult.details && (
                <p className="text-slate-300 text-sm">{testResult.details}</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            View Dashboard
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
