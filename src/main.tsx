import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamically synchronize canonical and OpenGraph URLs with current deployment origin
if (typeof window !== 'undefined' && window.location?.origin) {
  const origin = window.location.origin;
  const currentPath = window.location.pathname;

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', `${origin}${currentPath}`);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', `${origin}${currentPath}`);
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && !ogImage.getAttribute('content')?.startsWith(origin)) {
    ogImage.setAttribute('content', `${origin}/og-image.jpg`);
  }

  const ogImageSecure = document.querySelector('meta[property="og:image:secure_url"]');
  if (ogImageSecure && !ogImageSecure.getAttribute('content')?.startsWith(origin)) {
    ogImageSecure.setAttribute('content', `${origin}/og-image.jpg`);
  }

  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage && !twitterImage.getAttribute('content')?.startsWith(origin)) {
    twitterImage.setAttribute('content', `${origin}/og-image.jpg`);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
