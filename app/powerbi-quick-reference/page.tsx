'use client'

import { useState } from 'react'
import { Copy, CheckCircle, ExternalLink, Download } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PowerBIQuickReference() {
  const [copied, setCopied] = useState<string | null>(null)

  const credentials = [
    {
      name: 'Application (Client) ID',
      envVar: 'POWERBI_CLIENT_ID',
      description: 'From Azure App Registration > Overview',
      example: '12345678-1234-1234-1234-123456789012',
      where: 'Azure Portal > App Registrations > Your App > Overview'
    },
    {
      name: 'Directory (Tenant) ID',
      envVar: 'POWERBI_TENANT_ID',
      description: 'From Azure App Registration > Overview',
      example: '87654321-4321-4321-4321-210987654321',
      where: 'Azure Portal > App Registrations > Your App > Overview'
    },
    {
      name: 'Client Secret',
      envVar: 'POWERBI_CLIENT_SECRET',
      description: 'From Azure App Registration > Certificates & secrets',
      example: 'your-secret-value-here',
      where: 'Azure Portal > App Registrations > Your App > Certificates & secrets'
    },
    {
      name: 'Workspace ID',
      envVar: 'POWERBI_WORKSPACE_ID',
      description: 'From Power BI workspace URL',
      example: 'workspace-id-from-url',
      where: 'Power BI Portal > Workspaces > Your Workspace > URL'
    },
    {
      name: 'Group ID',
      envVar: 'POWERBI_GROUP_ID',
      description: 'Same as Workspace ID',
      example: 'same-as-workspace-id',
      where: 'Same as Workspace ID'
    },
    {
      name: 'Report ID',
      envVar: 'POWERBI_REPORT_ID',
      description: 'From Power BI report URL',
      example: 'report-id-from-url',
      where: 'Power BI Portal > Your Report > URL'
    }
  ]

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadEnvFile = () => {
    const envContent = credentials.map(cred => `${cred.envVar}=your-${cred.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`).join('\n')
    const blob = new Blob([envContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env.local'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Power BI Credentials Quick Reference
              </h1>
              <p className="text-slate-300 text-lg">
                All the credentials you need in one place
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={downloadEnvFile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download .env Template</span>
              </button>
              <a
                href="/powerbi-credentials-guide"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Detailed Guide</span>
              </a>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {credentials.map((cred, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{cred.name}</h3>
                <button
                  onClick={() => copyToClipboard(cred.envVar, `env-${index}`)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                >
                  {copied === `env-${index}` ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm">Environment Variable:</label>
                  <div className="bg-slate-700 rounded-lg p-2 mt-1">
                    <code className="text-blue-400 text-sm">{cred.envVar}</code>
                  </div>
                </div>
                
                <div>
                  <label className="text-slate-400 text-sm">Description:</label>
                  <p className="text-slate-300 text-sm mt-1">{cred.description}</p>
                </div>
                
                <div>
                  <label className="text-slate-400 text-sm">Where to find:</label>
                  <p className="text-slate-300 text-sm mt-1">{cred.where}</p>
                </div>
                
                <div>
                  <label className="text-slate-400 text-sm">Example:</label>
                  <div className="bg-slate-700 rounded-lg p-2 mt-1">
                    <code className="text-slate-300 text-xs">{cred.example}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Environment File Template */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Environment File Template</h2>
          <p className="text-slate-300 mb-4">Copy this to your .env.local file:</p>
          
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">.env.local</span>
              <button
                onClick={() => copyToClipboard(
                  credentials.map(cred => `${cred.envVar}=your-${cred.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`).join('\n'),
                  'env-file'
                )}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
              >
                {copied === 'env-file' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="text-slate-300 text-sm font-mono overflow-x-auto">
{credentials.map(cred => `${cred.envVar}=your-${cred.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`).join('\n')}
            </pre>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl flex items-center space-x-3"
          >
            <ExternalLink className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Azure Portal</h3>
              <p className="text-blue-100 text-sm">App Registrations</p>
            </div>
          </a>
          
          <a
            href="https://app.powerbi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 rounded-xl flex items-center space-x-3"
          >
            <ExternalLink className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Power BI Portal</h3>
              <p className="text-yellow-100 text-sm">Workspaces & Reports</p>
            </div>
          </a>
          
          <a
            href="/powerbi-setup"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl flex items-center space-x-3"
          >
            <ExternalLink className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Setup Page</h3>
              <p className="text-green-100 text-sm">Test Configuration</p>
            </div>
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
