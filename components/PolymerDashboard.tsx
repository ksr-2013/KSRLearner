'use client'

import { useState, useEffect } from 'react'
import { BarChart3, ExternalLink, Settings, RefreshCw, Maximize2, Minimize2, Brain, Zap } from 'lucide-react'

interface PolymerDashboardProps {
  workspaceId?: string
  dashboardId?: string
  apiKey?: string
  embedUrl?: string
}

export default function PolymerDashboard({ 
  workspaceId = 'ksrlearner',
  dashboardId,
  apiKey = '8dafdfaf-4477-41b9-bd42-88a6c377809e',
  embedUrl = 'https://v3.polymersearch.com/ksrlearner/Ksr\'s Workspace'
}: PolymerDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [demoData, setDemoData] = useState<any>(null)

  useEffect(() => {
    const loadPolymer = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load demo data first
        try {
          const response = await fetch('/api/polymer/demo-data')
          const data = await response.json()
          if (data.success) {
            setDemoData(data.data)
          }
        } catch (demoError) {
          console.log('Demo data not available, using fallback')
        }

        // If no API key, show demo mode
        if (!apiKey || apiKey === 'demo-key') {
          setIsLoading(false)
          return
        }

        // If no dashboard ID, embed the workspace directly
        if (!dashboardId) {
          initializeEmbed()
          return
        }

        // Load Polymer dashboard
        if (embedUrl) {
          initializeEmbed()
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        setError('Failed to initialize Polymer dashboard')
        setIsLoading(false)
      }
    }

    const initializeEmbed = () => {
      try {
        const iframe = document.createElement('iframe')
        iframe.src = embedUrl || 'https://v3.polymersearch.com/ksrlearner/Ksr\'s Workspace'
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.style.border = 'none'
        iframe.style.borderRadius = '8px'
        
        const container = document.getElementById('polymer-dashboard-container')
        if (container) {
          container.appendChild(iframe)
          setIsLoading(false)
        }
      } catch (err) {
        setError('Failed to embed Polymer dashboard')
        setIsLoading(false)
      }
    }

    loadPolymer()
  }, [dashboardId, apiKey, embedUrl, refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const openInPolymer = () => {
    window.open('https://app.polymersearch.com', '_blank')
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="text-center">
          <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Polymer AI Dashboard Unavailable</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">To set up Polymer AI integration:</p>
            <ul className="text-sm text-slate-500 text-left max-w-md mx-auto">
              <li>• Configure your Polymer workspace</li>
              <li>• Set up dashboard ID and API key</li>
              <li>• Create embed URL</li>
              <li>• Ensure proper permissions</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">AI-Powered Analytics</h3>
            <p className="text-sm text-slate-400">Powered by Polymer AI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={openInPolymer}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Open in Polymer"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
            <span>Loading Polymer AI Dashboard...</span>
          </div>
        </div>
      )}

      {/* Polymer Dashboard Container */}
      <div 
        id="polymer-dashboard-container" 
        className={`${isLoading ? 'hidden' : ''} ${isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-96'}`}
        style={{ minHeight: isFullscreen ? 'calc(100vh - 8rem)' : '384px' }}
      />

      {/* Demo Content (when Polymer is not configured) */}
      {(!apiKey || apiKey === 'demo-key') && (
        <div className="p-8">
          <div className="text-center mb-6">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Polymer AI Analytics Dashboard</h3>
            <p className="text-slate-400">AI-powered insights and automated analytics</p>
          </div>
          
          {/* AI Insights */}
          {demoData?.aiInsights && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {demoData.aiInsights.map((insight: any, index: number) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">{insight.title}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{insight.description}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    Confidence: {insight.confidence}%
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Performance Metrics */}
          {demoData?.performanceMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{demoData.performanceMetrics.accuracy}%</div>
                <div className="text-slate-400 text-sm">AI Accuracy</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{demoData.performanceMetrics.insights}</div>
                <div className="text-slate-400 text-sm">AI Insights</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{demoData.performanceMetrics.predictions}</div>
                <div className="text-slate-400 text-sm">Predictions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{demoData.performanceMetrics.automation}%</div>
                <div className="text-slate-400 text-sm">Automation</div>
              </div>
            </div>
          )}
          
          {/* AI-Generated Charts */}
          {demoData?.aiCharts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {demoData.aiCharts.map((chart: any, index: number) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">{chart.title}</h4>
                  <div className="space-y-3">
                    {chart.data.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Setup Notice */}
          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-purple-300">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Polymer AI Integration</span>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Configure your Polymer AI workspace to see live AI-powered analytics and automated insights.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
