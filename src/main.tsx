import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';      // React component
import './App.css';           // Tailwind + slick carousel first
import './index.css';         // Global custom styles last
import { installCalendlyLinks } from './lib/calendly';
import { routeFor } from './routes';

// Every calendly.com link on the site opens the booking pop-up.
installCalendlyLinks();

const render = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  // Once the page has drawn, drop the pre-load background colour.
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('app-ready')));
};

// Load the code for the page being opened before React takes over the
// prerendered HTML, so there is no blank frame.
const first = routeFor(window.location.pathname);
if (first) first.preload().then(render, render);
else render();
