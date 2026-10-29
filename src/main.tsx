import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';      // React component
import './App.css';           // Tailwind + slick carousel first
import './index.css';         // Global custom styles last
import { installCalendlyLinks } from './lib/calendly';

// Every calendly.com link on the site opens the booking pop-up.
installCalendlyLinks();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
