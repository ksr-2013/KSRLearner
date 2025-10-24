'use client'

import { useState, useEffect } from 'react'
import { BarChart3, ExternalLink, Settings, RefreshCw, Maximize2, Minimize2 } from 'lucide-react'

interface PowerBIDashboardProps {
  workspaceId?: string
  reportId?: string
  groupId?: string
  accessToken?: string
}

export default function PowerBIDashboard({ 
  workspaceId = 'your-workspace-id',
  reportId = 'your-report-id',
  groupId = 'your-group-id',
  accessToken
}: PowerBIDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [demoData, setDemoData] = useState<any>(null)

  // Power BI configuration
  const powerBIBaseUrl = 'https://app.powerbi.com'
  const embedUrl = `${powerBIBaseUrl}/reportEmbed?reportId=${reportId}&groupId=${groupId}&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtUkVESVJFQ1QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVsZW1lbnRzIjp0cnVlfX0%3d`

  useEffect(() => {
    const loadPowerBI = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load demo data first
        try {
          const response = await fetch('/api/powerbi/demo-data')
          const data = await response.json()
          if (data.success) {
            setDemoData(data.data)
          }
        } catch (demoError) {
          console.log('Demo data not available, using fallback')
        }

        // If no access token, show demo mode
        if (!accessToken || accessToken === 'demo-token') {
          setIsLoading(false)
          return
        }

        // Load Power BI JavaScript API
        if (!window.powerbi) {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/powerbi-client@2.22.0/dist/powerbi.min.js'
          script.onload = () => {
            initializeEmbed()
          }
          script.onerror = () => {
            setError('Failed to load Power BI client library')
            setIsLoading(false)
          }
          document.head.appendChild(script)
        } else {
          initializeEmbed()
        }
      } catch (err) {
        setError('Failed to initialize Power BI dashboard')
        setIsLoading(false)
      }
    }

    const initializeEmbed = () => {
      try {
        const config = {
          type: 'report',
          id: reportId,
          embedUrl: embedUrl,
          accessToken: accessToken || 'demo-token', // Replace with actual token
          tokenType: window.powerbi.models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              },
              pageNavigation: {
                visible: true
              }
            },
            background: window.powerbi.models.BackgroundType.Transparent,
            layoutType: window.powerbi.models.LayoutType.Custom,
            customLayout: {
              displayOption: window.powerbi.models.DisplayOption.FitToPage
            }
          }
        }

        const reportContainer = document.getElementById('powerbi-report-container')
        if (reportContainer && window.powerbi) {
          window.powerbi.embed(reportContainer, config)
          setIsLoading(false)
        }
      } catch (err) {
        setError('Failed to embed Power BI report')
        setIsLoading(false)
      }
    }

    loadPowerBI()
  }, [reportId, groupId, accessToken, refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const openInPowerBI = () => {
    window.open(`${powerBIBaseUrl}/groups/${groupId}/reports/${reportId}`, '_blank')
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Power BI Dashboard Unavailable</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">To set up Power BI integration:</p>
            <ul className="text-sm text-slate-500 text-left max-w-md mx-auto">
              <li>• Configure your Power BI workspace ID</li>
              <li>• Set up report ID and group ID</li>
              <li>• Add authentication token</li>
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
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>
            <p className="text-sm text-slate-400">Powered by Microsoft Power BI</p>
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
            onClick={openInPowerBI}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Open in Power BI"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Power BI Dashboard...</span>
          </div>
        </div>
      )}

      {/* Power BI Report Container */}
      <div 
        id="powerbi-report-container" 
        className={`${isLoading ? 'hidden' : ''} ${isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-96'}`}
        style={{ minHeight: isFullscreen ? 'calc(100vh - 8rem)' : '384px' }}
      />

      {/* Demo Content (when Power BI is not configured) */}
      {(!accessToken || accessToken === 'demo-token') && (
        <div className="p-8">
          <div className="text-center mb-6">
            <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Power BI Analytics Dashboard</h3>
            <p className="text-slate-400">Advanced learning analytics powered by Microsoft Power BI</p>
          </div>
          
          {/* Performance Metrics */}
          {demoData?.performanceMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{demoData.performanceMetrics.averageScore}%</div>
                <div className="text-slate-400 text-sm">Average Score</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{demoData.performanceMetrics.averageWPM}</div>
                <div className="text-slate-400 text-sm">WPM</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{demoData.performanceMetrics.completionRate}%</div>
                <div className="text-slate-400 text-sm">Completion Rate</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{demoData.performanceMetrics.streakDays}</div>
                <div className="text-slate-400 text-sm">Day Streak</div>
              </div>
            </div>
          )}
          
          {/* Learning Progress Chart */}
          {demoData?.learningProgress && (
            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <h4 className="text-white font-medium mb-4">Learning Progress (6 Months)</h4>
              <div className="space-y-3">
                {demoData.learningProgress.map((month: any, index: number) => (
                  <div key={month.month} className="flex items-center space-x-4">
                    <div className="w-12 text-slate-300 text-sm">{month.month}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Quizzes: {month.quizzes}</span>
                        <span>Typing: {month.typingTests}</span>
                        <span>Puzzles: {month.puzzles}</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((month.quizzes + month.typingTests + month.puzzles) / 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Category Breakdown */}
          {demoData?.categoryBreakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoData.categoryBreakdown.map((category: any, index: number) => (
                <div key={category.category} className="bg-slate-700/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">{category.category}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Score</span>
                      <span className="text-white">{category.score}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{category.attempts} attempts</span>
                      <span>{category.timeSpent}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Setup Notice */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-300">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Power BI Integration</span>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Configure your Power BI workspace to see live analytics and interactive dashboards.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
