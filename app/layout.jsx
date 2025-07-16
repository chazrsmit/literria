  'use client'
  
  import Footer from "./components/Footer";
  import Nav from "./components/Nav";
  import "./globals.css";
  import "bootstrap/dist/css/bootstrap.min.css";
  import { Provider } from 'react-redux'
  import { store } from '@/store'
  import { SessionProvider } from 'next-auth/react'



  export default function RootLayout({ children }) {
    return (
      <html lang="en">

        <body>
          <SessionProvider>
          <Provider store={store}>
            <div className="d-flex flex-column big-wrap ">
              <div className="site-wrap ">
                <Nav />
                  <main>{children}</main>
              </div>
              <div className="">
                <Footer />
              </div>
            </div>
          </Provider>
          </SessionProvider>
        </body>
      </html>
    );
  }
