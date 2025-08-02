import { useState, useEffect } from 'react'
import { translate } from '../utils/languages'

function AnalyticsDashboard({ reports, patients, language = 'en' }) {
  const [timeRange, setTimeRange] = useState('week')
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    totalPatients: 0,
    averageProcessingTime: 0,
    criticalCases: 0,
    commonConditions: [],
    monthlyTrend: [],
    languageUsage: {},
    deviceUsage: {}
  })

  useEffect(() => {
    calculateAnalytics()
  }, [reports, patients, timeRange])

  const calculateAnalytics = () => {
    const now = new Date()
    const filteredReports = reports.filter(report => {
      const reportDate = new Date(report.createdAt)
      const diffTime = Math.abs(now - reportDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      switch (timeRange) {
        case 'week': return diffDays <= 7
        case 'month': return diffDays <= 30
        case 'quarter': return diffDays <= 90
        default: return true
      }
    })

    // Calculate common conditions
    const conditions = {}
    filteredReports.forEach(report => {
      if (report.summary?.interpretation) {
        const text = report.summary.interpretation.toLowerCase()
        const medicalTerms = [
          'diabetes', 'hypertension', 'fever', 'infection', 'pain',
          'inflammation', 'swelling', 'dizziness', 'nausea', 'fatigue'
        ]
        
        medicalTerms.forEach(term => {
          if (text.includes(term)) {
            conditions[term] = (conditions[term] || 0) + 1
          }
        })
      }
    })

    const commonConditions = Object.entries(conditions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([condition, count]) => ({ condition, count }))

    setAnalytics({
      totalReports: filteredReports.length,
      totalPatients: new Set(filteredReports.map(r => r.patientId).filter(Boolean)).size,
      averageProcessingTime: 2.5, // Mock data
      criticalCases: filteredReports.filter(r => r.summary?.interpretation?.toLowerCase().includes('critical')).length,
      commonConditions,
      monthlyTrend: generateMonthlyTrend(filteredReports),
      languageUsage: { 'en': 60, 'hi': 30, 'mr': 10 }, // Mock data
      deviceUsage: { 'mobile': 80, 'desktop': 20 } // Mock data
    })
  }

  const generateMonthlyTrend = (reports) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      reports: Math.floor(Math.random() * 20) + 5 // Mock data
    }))
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 {translate('analytics.title', language)}
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="week">{translate('analytics.timeRanges.week', language)}</option>
          <option value="month">{translate('analytics.timeRanges.month', language)}</option>
          <option value="quarter">{translate('analytics.timeRanges.quarter', language)}</option>
          <option value="all">{translate('analytics.timeRanges.all', language)}</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalReports}</div>
          <div className="text-sm text-blue-600">{translate('analytics.totalReports', language)}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{analytics.totalPatients}</div>
          <div className="text-sm text-green-600">{translate('analytics.totalPatients', language)}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{analytics.criticalCases}</div>
          <div className="text-sm text-yellow-600">{translate('analytics.criticalCases', language)}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{analytics.averageProcessingTime}s</div>
          <div className="text-sm text-purple-600">{translate('analytics.avgProcessingTime', language)}</div>
        </div>
      </div>

      {/* Common Conditions */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('analytics.commonConditions', language)}
        </h4>
        <div className="space-y-2">
          {analytics.commonConditions.map((condition, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{condition.condition}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor((condition.count / analytics.totalReports) * 100)}`}
                    style={{ width: `${(condition.count / analytics.totalReports) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">{condition.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('analytics.monthlyTrend', language)}
        </h4>
        <div className="flex items-end space-x-2 h-32">
          {analytics.monthlyTrend.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(item.reports / Math.max(...analytics.monthlyTrend.map(t => t.reports))) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-600 mt-1">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Language Usage */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('analytics.languageUsage', language)}
        </h4>
        <div className="space-y-2">
          {Object.entries(analytics.languageUsage).map(([lang, percentage]) => (
            <div key={lang} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{translate(`languages.${lang}`, language)}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">{percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('analytics.insights', language)}
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-2">📈</span>
            {translate('analytics.insights.trend', language)}
          </div>
          <div className="flex items-center">
            <span className="mr-2">🎯</span>
            {translate('analytics.insights.efficiency', language)}
          </div>
          <div className="flex items-center">
            <span className="mr-2">🚨</span>
            {translate('analytics.insights.critical', language)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard 