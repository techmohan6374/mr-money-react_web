import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { DataProvider } from './context/DataContext'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "411393513465-tjij85b0qpnmjijvdh1d28jrdk5p09rb.apps.googleusercontent.com"}>
    <DataProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#10B981',
            colorPrimaryHover: '#059669',
            borderRadius: 8,
            fontFamily: 'Outfit, sans-serif',
          },
        }}
      >
        <App />
      </ConfigProvider>
    </DataProvider>
  </GoogleOAuthProvider>
)