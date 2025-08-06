import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/components/theme-provider'
// import "../css/app.css"
import { Toaster } from "@/components/ui/sonner"

const pages = import.meta.glob([
  '/resources/pages/**/*.jsx',
  '/modules/*/Views/**/*.jsx'
], { eager: true })

createInertiaApp({
  resolve: name => {

    const pagePath = `/resources/pages/${name}.jsx`;
    if (pages[pagePath]) {
      return pages[pagePath].default || pages[pagePath];
    }

    const modulePageKey = Object.keys(pages).find(key => {
      return key.endsWith(`Views/${name}.jsx`);
    });

    if (modulePageKey) {
      return pages[modulePageKey].default || pages[modulePageKey];
    }

    const errorPage = pages['/resources/pages/Error404.jsx'];
    return errorPage?.default || errorPage;
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <App {...props} />
        <Toaster position="bottom-center" closeButton />
      </ThemeProvider>
    );
  },

  /**
   * Configuration for the Inertia progress bar.
   */
  progress: {
    color: '#FA2C37',
    showSpinner: false,
  },
});