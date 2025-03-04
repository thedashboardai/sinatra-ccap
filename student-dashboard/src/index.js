import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Make sure DOM is fully loaded before trying to access the root element
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("Could not find element with id 'root'");
  }
});