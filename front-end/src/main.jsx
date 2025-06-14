import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './utils/axiosConfig' // Import axios configuration
import {GoogleOAuthProvider} from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='692875397336-27869t2g7es3se7nc73keam81eos6qlj.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
)
