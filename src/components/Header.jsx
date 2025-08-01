import React from 'react'
import { translate } from '../utils/languages'

const Header = ({ language = 'en' }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <div className="title-container">
            <div className="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="main-title">{translate('header.title', language)}</h1>
            <div className="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="subtitle">{translate('header.subtitle', language)}</p>
        </div>
      </div>
    </header>
  )
}

export default Header