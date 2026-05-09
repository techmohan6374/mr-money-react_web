import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="411393513465-tjij85b0qpnmjijvdh1d28jrdk5p09rb.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)