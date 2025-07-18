'use client'

import Footer from "./components/Footer"
import Nav from "./components/Nav"
import "./globals.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from 'react-redux'
import { store } from '@/store'
import { SessionProvider } from 'next-auth/react'
import AppInitializer from './components/AppInitializer' 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Provider store={store}>
            <AppInitializer /> 
            <div className="d-flex flex-column big-wrap ">
              <div className="site-wrap ">
                <Nav />
                <main>{children}</main>
              </div>
              <Footer />
            </div>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  )
}
