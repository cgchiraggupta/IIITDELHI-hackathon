import React from 'react'
import { translate } from '../utils/languages'

const Header = ({ language = 'en' }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1 className="main-title">{translate('header.title', language)}</h1>
          <p className="subtitle">{translate('header.subtitle', language)}</p>
        </div>
      </div>
    </header>
  )
}

export default Header