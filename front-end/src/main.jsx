import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './utils/axiosConfig' // Import axios configuration
import { GoogleOAuthProvider } from '@react-oauth/google'

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

async function bootstrap() {
  try {
    const apiBase = import.meta.env.VITE_API_BASE_URL;

    if (!apiBase) {
      console.warn('[main.jsx] Missing VITE_API_BASE_URL. Falling back to local backend.');
    }

    const response = await fetch(
      `${apiBase || 'http://localhost:3000'}/api/users/google-client-id`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Google client ID. Status: ${response.status}`);
    }

    const data = await response.json();
    const clientId = data?.clientId;

    if (!clientId) {
      console.error(
        '[main.jsx] GOOGLE_CLIENT_ID is not configured on the server. Google login will be disabled.'
      );
      renderApp();
      return;
    }

    renderApp(clientId);
  } catch (error) {
    console.error('[main.jsx] Failed to initialize Google OAuth:', error);
    renderApp();
  }
}

function renderApp(clientId) {
  const app = (
    clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )
  );

  root.render(app);
}

bootstrap();
