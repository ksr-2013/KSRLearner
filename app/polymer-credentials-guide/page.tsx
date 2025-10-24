'use client'

import { useState } from 'react'
import { CheckCircle, ExternalLink, Copy, Eye, EyeOff, AlertCircle, Info, Brain, Zap } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PolymerCredentialsGuide() {
  const [activeStep, setActiveStep] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState(false)

  const steps = [
    { id: 1, title: 'Polymer AI Account', description: 'Create account and workspace' },
    { id: 2, title: 'Dashboard Setup', description: 'Configure AI dashboard' },
    { id: 3, title: 'API Configuration', description: 'Get API keys and URLs' },
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

  const openPolymerPortal = () => {
    window.open('https://app.polymersearch.com', '_blank')
  }

  const openPolymerDocs = () => {
    window.open('https://docs.polymersearch.com', '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Polymer AI Credentials Guide
          </h1>
          <p className="text-slate-300 text-lg">
            Complete step-by-step guide to obtain all Polymer AI credentials
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
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.id ? 'bg-white text-purple-600' : 'bg-slate-600 text-slate-300'
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

        {/* Step 1: Polymer AI Account */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 1: Polymer AI Account Setup</h2>
              <p className="text-slate-300 mb-6">
                Create a Polymer AI account and set up your workspace for intelligent analytics.
              </p>

              <div className="space-y-6">
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-purple-300">AI Features</span>
                  </div>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Automated insights and pattern recognition</li>
                    <li>• Predictive analytics and recommendations</li>
                    <li>• Natural language data queries</li>
                    <li>• Real-time AI-powered dashboards</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                    <div>
                      <h3 className="text-white font-medium">Go to Polymer Portal</h3>
                      <p className="text-slate-400 text-sm mb-2">Sign up for Polymer AI</p>
                      <button
                        onClick={openPolymerPortal}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Polymer Portal</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                    <div>
                      <h3 className="text-white font-medium">Create Account</h3>
                      <p className="text-slate-400 text-sm mb-2">Sign up with your email</p>
                      <ol className="text-slate-300 text-sm space-y-1 ml-4">
                        <li>1. Click "Sign Up" on Polymer homepage</li>
                        <li>2. Enter your email and password</li>
                        <li>3. Verify your email address</li>
                        <li>4. Complete the onboarding process</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                    <div>
                      <h3 className="text-white font-medium">Create Workspace</h3>
                      <p className="text-slate-400 text-sm mb-2">Set up your AI workspace</p>
                      <ol className="text-slate-300 text-sm space-y-1 ml-4">
                        <li>1. Click "Create Workspace"</li>
                        <li>2. Name: "KSRLearner AI Analytics"</li>
                        <li>3. Description: "AI-powered learning analytics"</li>
                        <li>4. Choose "Education" as industry</li>
                        <li>5. Click "Create Workspace"</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">4</div>
                    <div>
                      <h3 className="text-white font-medium">Get Workspace ID</h3>
                      <p className="text-slate-400 text-sm mb-2">Copy the workspace ID from URL</p>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-slate-300 text-sm mb-2">Workspace URL format:</div>
                        <div className="text-slate-400 text-xs font-mono bg-slate-800 p-2 rounded">
                          https://app.polymersearch.com/workspace/<span className="text-yellow-400">WORKSPACE_ID</span>/dashboard
                        </div>
                        <div className="text-slate-400 text-xs mt-2">
                          The workspace ID is the long string after /workspace/
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dashboard Setup */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 2: AI Dashboard Configuration</h2>
              <p className="text-slate-300 mb-6">
                Create and configure your AI-powered analytics dashboard.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <div>
                    <h3 className="text-white font-medium">Create AI Dashboard</h3>
                    <p className="text-slate-400 text-sm mb-2">Set up your intelligent dashboard</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. In your workspace, click "Create Dashboard"</li>
                      <li>2. Choose "AI-Powered Analytics" template</li>
                      <li>3. Name: "KSRLearner AI Insights"</li>
                      <li>4. Enable "Auto Insights" and "Predictive Analytics"</li>
                      <li>5. Click "Create Dashboard"</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <div>
                    <h3 className="text-white font-medium">Configure AI Features</h3>
                    <p className="text-slate-400 text-sm mb-2">Enable intelligent analytics</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. Go to Dashboard Settings</li>
                      <li>2. Enable "Automated Insights"</li>
                      <li>3. Enable "Pattern Recognition"</li>
                      <li>4. Enable "Predictive Analytics"</li>
                      <li>5. Set AI confidence threshold to 85%</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <div>
                    <h3 className="text-white font-medium">Get Dashboard ID</h3>
                    <p className="text-slate-400 text-sm mb-2">Copy the dashboard ID from URL</p>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="text-slate-300 text-sm mb-2">Dashboard URL format:</div>
                      <div className="text-slate-400 text-xs font-mono bg-slate-800 p-2 rounded">
                        https://app.polymersearch.com/dashboard/<span className="text-yellow-400">DASHBOARD_ID</span>
                      </div>
                      <div className="text-slate-400 text-xs mt-2">
                        The dashboard ID is the long string after /dashboard/
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: API Configuration */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Step 3: API Configuration</h2>
              <p className="text-slate-300 mb-6">
                Get your API key and configure embedding options.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <div>
                    <h3 className="text-white font-medium">Get API Key</h3>
                    <p className="text-slate-400 text-sm mb-2">Generate your API key</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. Go to Account Settings</li>
                      <li>2. Navigate to "API Keys"</li>
                      <li>3. Click "Generate New Key"</li>
                      <li>4. Name: "KSRLearner Integration"</li>
                      <li>5. Select scopes: dashboard:read, analytics:read</li>
                      <li>6. Click "Generate" and copy the key</li>
                    </ol>
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 mt-3">
                      <div className="flex items-center space-x-2 text-red-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Important!</span>
                      </div>
                      <p className="text-slate-300 text-sm mt-1">
                        The API key is only shown once. Copy it immediately and store it securely.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <div>
                    <h3 className="text-white font-medium">Configure Embedding</h3>
                    <p className="text-slate-400 text-sm mb-2">Set up dashboard embedding</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. Go to Dashboard Settings</li>
                      <li>2. Click "Embed" tab</li>
                      <li>3. Enable "Public Embedding"</li>
                      <li>4. Copy the Embed URL</li>
                      <li>5. Set permissions to "Read Only"</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <div>
                    <h3 className="text-white font-medium">Test API Connection</h3>
                    <p className="text-slate-400 text-sm mb-2">Verify your API key works</p>
                    <ol className="text-slate-300 text-sm space-y-1 ml-4">
                      <li>1. Use the API documentation</li>
                      <li>2. Test with a simple GET request</li>
                      <li>3. Verify workspace access</li>
                      <li>4. Check dashboard permissions</li>
                    </ol>
                    <button
                      onClick={openPolymerDocs}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View API Docs</span>
                    </button>
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
                      <span className="text-slate-300 text-sm">POLYMER_WORKSPACE_ID</span>
                      <button
                        onClick={() => copyToClipboard('POLYMER_WORKSPACE_ID=your-workspace-id', 'workspace')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'workspace' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POLYMER_DASHBOARD_ID</span>
                      <button
                        onClick={() => copyToClipboard('POLYMER_DASHBOARD_ID=your-dashboard-id', 'dashboard')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'dashboard' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POLYMER_API_KEY</span>
                      <button
                        onClick={() => copyToClipboard('POLYMER_API_KEY=your-api-key', 'api-key')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'api-key' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POLYMER_EMBED_URL</span>
                      <button
                        onClick={() => copyToClipboard('POLYMER_EMBED_URL=your-embed-url', 'embed-url')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'embed-url' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                      <span className="text-slate-300 text-sm">POLYMER_API_URL</span>
                      <button
                        onClick={() => copyToClipboard('POLYMER_API_URL=https://api.polymersearch.com', 'api-url')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copied === 'api-url' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-300">AI Features Enabled</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    After adding all environment variables, restart your development server and test the Polymer AI integration.
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
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
