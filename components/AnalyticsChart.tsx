'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface ChartData {
  label: string
  value: number
  color?: string
  trend?: number
}

interface AnalyticsChartProps {
  title: string
  data: ChartData[]
  type?: 'bar' | 'line' | 'progress'
  height?: number
  showTrend?: boolean
}

export default function AnalyticsChart({ 
  title, 
  data, 
  type = 'bar', 
  height = 200,
  showTrend = true 
}: AnalyticsChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartData[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setAnimatedData(data)
      setIsAnimating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [data])

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))

  const getBarHeight = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * (height - 40) + 20
  }

  const getProgressWidth = (value: number) => {
    return (value / maxValue) * 100
  }

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    )
  }

  const getTrendColor = (trend?: number) => {
    if (!trend) return 'text-slate-400'
    return trend > 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div className="bg-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          {title}
        </h4>
        {showTrend && (
          <div className="flex items-center space-x-1 text-sm">
            <span className="text-slate-400">Trend:</span>
            <span className="text-green-400">+12%</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {type === 'bar' && (
          <div className="flex items-end space-x-2" style={{ height: `${height}px` }}>
            {animatedData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-slate-600 rounded-t-lg relative overflow-hidden">
                  <div
                    className={`transition-all duration-1000 ease-out ${
                      item.color || 'bg-gradient-to-t from-blue-500 to-purple-500'
                    }`}
                    style={{
                      height: `${isAnimating ? 0 : getBarHeight(item.value)}px`,
                      width: '100%'
                    }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-white text-sm font-medium">{item.value}</div>
                  <div className="text-slate-400 text-xs">{item.label}</div>
                  {item.trend && (
                    <div className={`flex items-center justify-center mt-1 ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="text-xs ml-1">{item.trend > 0 ? '+' : ''}{item.trend}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {type === 'line' && (
          <div className="relative" style={{ height: `${height}px` }}>
            <svg width="100%" height="100%" className="overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={animatedData.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100
                  const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 80
                  return `${x},${y}`
                }).join(' ')}
                className="transition-all duration-1000 ease-out"
                style={{
                  strokeDasharray: isAnimating ? '1000' : '0',
                  strokeDashoffset: isAnimating ? '1000' : '0'
                }}
              />
              {animatedData.map((item, index) => {
                const x = (index / (data.length - 1)) * 100
                const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 80
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3B82F6"
                    className="transition-all duration-1000 ease-out"
                    style={{
                      opacity: isAnimating ? 0 : 1,
                      transform: isAnimating ? 'scale(0)' : 'scale(1)'
                    }}
                  />
                )
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400">
              {animatedData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-white font-medium">{item.value}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'progress' && (
          <div className="space-y-3">
            {animatedData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{item.value}</span>
                    {item.trend && (
                      <div className={`flex items-center ${getTrendColor(item.trend)}`}>
                        {getTrendIcon(item.trend)}
                        <span className="text-xs ml-1">{item.trend > 0 ? '+' : ''}{item.trend}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      item.color || 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{
                      width: `${isAnimating ? 0 : getProgressWidth(item.value)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
