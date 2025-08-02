import { useState, useEffect } from 'react'
import { translate } from '../utils/languages'

function CollaborationPanel({ report, language = 'en' }) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [collaborators, setCollaborators] = useState([])
  const [newCollaborator, setNewCollaborator] = useState('')

  const generateShareLink = () => {
    const baseUrl = window.location.origin
    const reportId = report?.id || Date.now()
    const link = `${baseUrl}/report/${reportId}`
    setShareLink(link)
    setIsSharing(true)
    
    // Copy to clipboard
    navigator.clipboard.writeText(link).then(() => {
      // Show success notification
      console.log('Link copied to clipboard')
    })
  }

  const addCollaborator = () => {
    if (newCollaborator.trim()) {
      setCollaborators(prev => [...prev, {
        id: Date.now(),
        email: newCollaborator,
        role: 'viewer',
        addedAt: new Date().toISOString()
      }])
      setNewCollaborator('')
    }
  }

  const removeCollaborator = (id) => {
    setCollaborators(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {translate('collaboration.title', language)}
      </h3>
      
      {/* Share Report */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('collaboration.shareReport', language)}
        </h4>
        
        {!isSharing ? (
          <button
            onClick={generateShareLink}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            {translate('collaboration.generateLink', language)}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                {translate('collaboration.copy', language)}
              </button>
            </div>
            <button
              onClick={() => setIsSharing(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              {translate('collaboration.close', language)}
            </button>
          </div>
        )}
      </div>

      {/* Add Collaborators */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('collaboration.addCollaborators', language)}
        </h4>
        
        <div className="flex space-x-2 mb-3">
          <input
            type="email"
            value={newCollaborator}
            onChange={(e) => setNewCollaborator(e.target.value)}
            placeholder={translate('collaboration.emailPlaceholder', language)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCollaborator}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {translate('collaboration.add', language)}
          </button>
        </div>

        {/* Collaborators List */}
        {collaborators.length > 0 && (
          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium text-gray-800">{collaborator.email}</div>
                  <div className="text-sm text-gray-500">
                    {translate('collaboration.role', language)}: {translate(`collaboration.roles.${collaborator.role}`, language)}
                  </div>
                </div>
                <button
                  onClick={() => removeCollaborator(collaborator.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  {translate('collaboration.remove', language)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Chat */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {translate('collaboration.chat', language)}
        </h4>
        <div className="bg-gray-50 rounded-md p-3 text-center text-gray-500">
          {translate('collaboration.chatComingSoon', language)}
        </div>
      </div>
    </div>
  )
}

export default CollaborationPanel 