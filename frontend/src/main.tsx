import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { AuthDialogProvider } from './contexts/AuthDialogContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AuthDialogProvider>
      <App />
    </AuthDialogProvider>
  </AuthProvider>
);
