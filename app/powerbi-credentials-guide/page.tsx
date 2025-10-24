'use client'

import { useState } from 'react'
import { CheckCircle, ExternalLink, Copy, Eye, EyeOff, AlertCircle, Info } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PowerBICredentialsGuide() {
  const [activeStep, setActiveStep] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState(false)

  const steps = [
    { id: 1, title: 'Azure App Registration', description: 'Create app registration in Azure AD' },
    { id: 2, title: 'Power BI Workspace', description: 'Set up workspace and get IDs' },
    { id: 3, title: 'Report Creation', description: 'Create and configure reports' },
    { id: 4, title: 'Environment Setup', description: 'Add credentials to environment' }
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

  const openAzurePortal = () => {
    window.open('https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade', '_blank')
  }

  const openPowerBIPortal = () => {
    window.open('https://app.powerbi.com', '_blank')
  }

  const openAzureAD = () => {
    window.open('https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview', '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Power BI Credentials Guide
          </h1>
          <p className="text-slate-300 text-lg">
            Complete step-by-step guide to obtain all Power BI credentials
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Setup Progress</h2>
            <div className="text-slate-400 text-sm">
              Step {activeStep} of {steps.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.id ? 'bg-white text-blue-600' : 'bg-slate-600 text-slate-300'
                  }`}>
                    {step.id}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
                <p className="text-sm opacity-80">{step.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 1: Azure App Registration */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 1: Azure App Registration</h2>
              <p className="text-slate-300 mb-6">
                Create an app registration in Azure Active Directory to authenticate with Power BI.
              </p>

              <div className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-blue-300">Prerequisites</span>
                  </div>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Azure subscription (free tier works)</li>
                    <li>• Power BI Pro license (or trial)</li>
                    <li>• Admin access to Azure AD (or request from admin)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                    <div>
                      <h3 className="text-white font-medium">Go to Azure Portal</h3>
                      <p className="text-slate-400 text-sm mb-2">Navigate to Azure Active Directory</p>
                      <button
                        onClick={openAzureAD}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Azure AD</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                    <div>
                      <h3 className="text-white font-medium">Create App Registration</h3>
                      <p className="text-slate-400 text-sm mb-2">Register a new application</p>
                      <ol className="text-slate-300 text-sm space-y-1 ml-4">
                        <li>1. Click "App registrations" in the left menu</li>
                        <li>2. Click "New registration"</li>
                        <li>3. Name: "KSRLearner Power BI Integration"</li>
                        <li>4. Supported account types: "Accounts in this organizational directory only"</li>
                        <li>5. Redirect URI: Leave blank for now</li>
                        <li>6. Click "Register"</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                    <div>
                      <h3 className="text-white font-medium">Get Application (Client) ID</h3>
                      <p className="text-slate-400 text-sm mb-2">Copy the Application (client) ID</p>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Application (client) ID</span>
                          <button
                            onClick={() => copyToClipboard('your-application-client-id', 'client-id')}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            {copied === 'client-id' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Copy this from the Overview page</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
                    <div>
                      <h3 className="text-white font-medium">Get Directory (Tenant) ID</h3>
                      <p className="text-slate-400 text-sm mb-2">Copy the Directory (tenant) ID</p>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Directory (tenant) ID</span>
                          <button
                            onClick={() => copyToClipboard('your-directory-tenant-id', 'tenant-id')}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            {copied === 'tenant-id' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Copy this from the Overview page</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">5</div>
                    <div>
                      <h3 className="text-white font-medium">Create Client Secret</h3>
                      <p className="text-slate-400 text-sm mb-2">Generate a client secret for authentication</p>
                      <ol className="text-slate-300 text-sm space-y-1 ml-4">
                        <li>1. Go to "Certificates & secrets" in the left menu</li>
                        <li>2. Click "New client secret"</li>
                        <li>3. Description: "Power BI Integration Secret"</li>
                        <li>4. Expires: "24 months" (or your preference)</li>
                        <li>5. Click "Add"</li>
                        <li>6. <strong className="text-red-400">IMMEDIATELY COPY THE SECRET VALUE</strong></li>
                      </ol>
                      <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 mt-3">
                        <div className="flex items-center space-x-2 text-red-300">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium">Important!</span>
                        </div>
                        <p className="text-slate-300 text-sm mt-1">
                          The secret value is only shown once. Copy it immediately and store it securely.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Power BI Workspace */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 2: Power BI Workspace Setup</h2>
              <p className="text-slate-300 mb-6">
                Create a Power BI workspace and get the workspace ID.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <div>
                    <h3 className="text-white font-medium">Go to Power BI Portal</h3>
                    <p className="text-slate-400 text-sm mb-2">Open Power BI service</p>
                    <button
                      onClick={openPowerBIPortal}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Power BI</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <div>
                    <h3 className="text-white font-medium">Create Workspace</h3>
                    <p className="text-slate-400 text-sm mb-2">Create a new workspace for your reports</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. Click "Workspaces" in the left menu</li>
                      <li>2. Click "Create workspace"</li>
                      <li>3. Name: "KSRLearner Analytics"</li>
                      <li>4. Description: "Learning analytics dashboard"</li>
                      <li>5. Click "Save"</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <div>
                    <h3 className="text-white font-medium">Get Workspace ID</h3>
                    <p className="text-slate-400 text-sm mb-2">Copy the workspace ID from the URL</p>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-slate-300 text-sm mb-2">Workspace URL format:</div>
                      <div className="text-slate-400 text-xs font-mono bg-slate-800 p-2 rounded">
                        https://app.powerbi.com/groups/<span className="text-yellow-400">WORKSPACE_ID</span>/list
                      </div>
                      <div className="text-slate-400 text-xs mt-2">
                        The workspace ID is the long string between /groups/ and /list
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
                  <div>
                    <h3 className="text-white font-medium">Get Group ID</h3>
                    <p className="text-slate-400 text-sm mb-2">The Group ID is the same as Workspace ID</p>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">Group ID = Workspace ID</span>
                        <button
                          onClick={() => copyToClipboard('your-workspace-id', 'group-id')}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {copied === 'group-id' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">Use the same ID for both workspace and group</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Report Creation */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 3: Create Power BI Report</h2>
              <p className="text-slate-300 mb-6">
                Create a report in your workspace and get the report ID.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <div>
                    <h3 className="text-white font-medium">Create Sample Report</h3>
                    <p className="text-slate-400 text-sm mb-2">Create a new report in your workspace</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. In your workspace, click "Create"</li>
                      <li>2. Select "Report"</li>
                      <li>3. Choose "Start from scratch"</li>
                      <li>4. Name: "KSRLearner Analytics"</li>
                      <li>5. Add some sample visualizations</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <div>
                    <h3 className="text-white font-medium">Get Report ID</h3>
                    <p className="text-slate-400 text-sm mb-2">Copy the report ID from the URL</p>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-slate-300 text-sm mb-2">Report URL format:</div>
                      <div className="text-slate-400 text-xs font-mono bg-slate-800 p-2 rounded">
                        https://app.powerbi.com/reportEmbed?reportId=<span className="text-yellow-400">REPORT_ID</span>&groupId=WORKSPACE_ID
                      </div>
                      <div className="text-slate-400 text-xs mt-2">
                        The report ID is the long string after reportId=
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <div>
                    <h3 className="text-white font-medium">Configure Permissions</h3>
                    <p className="text-slate-400 text-sm mb-2">Set up proper permissions for embedding</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. Go to report settings</li>
                      <li>2. Enable "Allow embedding"</li>
                      <li>3. Set access to "Specific people" or "Everyone"</li>
                      <li>4. Save settings</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Environment Setup */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 4: Environment Variables</h2>
              <p className="text-slate-300 mb-6">
                Add all credentials to your environment variables.
              </p>

              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Add to .env.local file:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POWERBI_WORKSPACE_ID</span>
                      <button
                        onClick={() => copyToClipboard('POWERBI_WORKSPACE_ID=your-workspace-id', 'workspace')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'workspace' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POWERBI_REPORT_ID</span>
                      <button
                        onClick={() => copyToClipboard('POWERBI_REPORT_ID=your-report-id', 'report')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'report' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POWERBI_GROUP_ID</span>
                      <button
                        onClick={() => copyToClipboard('POWERBI_GROUP_ID=your-group-id', 'group')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'group' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POWERBI_CLIENT_ID</span>
                      <button
                        onClick={() => copyToClipboard('POWERBI_CLIENT_ID=your-client-id', 'client')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'client' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POWERBI_CLIENT_SECRET</span>
                      <button
                        onClick={() => copyToClipboard('POWERBI_CLIENT_SECRET=your-client-secret', 'secret')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'secret' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POWERBI_TENANT_ID</span>
                      <button
                        onClick={() => copyToClipboard('POWERBI_TENANT_ID=your-tenant-id', 'tenant')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'tenant' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-300">Complete Setup</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    After adding all environment variables, restart your development server and test the Power BI integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-2 rounded-lg"
          >
            Previous
          </button>
          
          <button
            onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
            disabled={activeStep === 4}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
