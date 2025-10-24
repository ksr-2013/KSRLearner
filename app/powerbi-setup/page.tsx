'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Settings, CheckCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react'

interface PowerBIConfig {
  workspaceId: string
  reportId: string
  groupId: string
  clientId: string
  embedUrl: string
  scopes: string[]
}

export default function PowerBISetupPage() {
  const [config, setConfig] = useState<PowerBIConfig | null>(null)
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
      const response = await fetch('/api/powerbi/config')
      const data = await response.json()
      
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to fetch Power BI config:', error)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/powerbi/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test-connection',
          credentials: {
            accessToken: 'demo-token' // Replace with actual token
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

  const openPowerBIPortal = () => {
    window.open('https://app.powerbi.com', '_blank')
  }

  const openAzurePortal = () => {
    window.open('https://portal.azure.com', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Power BI configuration...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">
            Power BI Dashboard Setup
          </h1>
          <p className="text-slate-300 text-lg">
            Configure Microsoft Power BI integration for advanced analytics
          </p>
        </div>

        {/* Setup Steps */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Setup Steps
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="text-white font-medium">Create Power BI App Registration</h3>
                <p className="text-slate-400 text-sm">Register your application in Azure Active Directory</p>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={openAzurePortal}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mr-4"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open Azure Portal
                  </button>
                  <div className="text-xs text-slate-500">
                    Get: Client ID, Tenant ID, and create Client Secret
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="text-white font-medium">Configure Power BI Workspace</h3>
                <p className="text-slate-400 text-sm">Set up your workspace and create reports</p>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={openPowerBIPortal}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mr-4"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open Power BI Portal
                  </button>
                  <div className="text-xs text-slate-500">
                    Get: Workspace ID and Report ID from URLs
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
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
                  Report ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={config.reportId}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                  />
                  <button
                    onClick={() => copyToClipboard(config.reportId, 'report')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'report' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Group ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={config.groupId}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                  />
                  <button
                    onClick={() => copyToClipboard(config.groupId, 'group')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'group' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={config.clientId}
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
                    onClick={() => copyToClipboard(config.clientId, 'client')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    {copied === 'client' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">🔑 Credential Quick Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">From Azure Portal</h3>
              <div className="space-y-1 text-sm">
                <div className="text-slate-300">• Client ID → App Registration → Overview</div>
                <div className="text-slate-300">• Tenant ID → App Registration → Overview</div>
                <div className="text-slate-300">• Client Secret → Certificates & secrets</div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">From Power BI Portal</h3>
              <div className="space-y-1 text-sm">
                <div className="text-slate-300">• Workspace ID → Workspace URL</div>
                <div className="text-slate-300">• Group ID → Same as Workspace ID</div>
                <div className="text-slate-300">• Report ID → Report URL</div>
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
                <div className="text-slate-300">POWERBI_WORKSPACE_ID=your-workspace-id</div>
                <div className="text-slate-300">POWERBI_REPORT_ID=your-report-id</div>
                <div className="text-slate-300">POWERBI_GROUP_ID=your-group-id</div>
                <div className="text-slate-300">POWERBI_CLIENT_ID=your-client-id</div>
                <div className="text-slate-300">POWERBI_CLIENT_SECRET=your-client-secret</div>
                <div className="text-slate-300">POWERBI_TENANT_ID=your-tenant-id</div>
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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Test Power BI Connection</span>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            View Dashboard
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
