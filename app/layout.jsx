  'use client'
  
  import Footer from "./components/Footer";
  import Nav from "./components/Nav";
  import "./globals.css";
  import "bootstrap/dist/css/bootstrap.min.css";
  import { Provider } from 'react-redux'
  import { store } from '@/store'

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <Provider store={store}>
            <Nav />
            <main>{children}</main>
            <Footer />
          </Provider>
        </body>
      </html>
    );
  }
