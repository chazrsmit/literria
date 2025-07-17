'use client'

import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import './auth.css'

export default function AuthPage() {

    const { data: session } = useSession()

    const [formData, setFormData] = useState({
    email: '',
    password: ''})

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })}

      const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
    }

    return(
        <>
        <div className="page-auth">
            {session ? (
            <>
                <p>Connecté en tant que {session.user?.name}</p>
                <button onClick={()=>signOut()}>Log out</button>
            </>
            )
            : (
                <>
                <div className="d-flex flex-column align-items-center">
                  <div className="auth">
                {/* Sign in */}
                    <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        {/* <label htmlFor="email">
                        Email
                        </label> */}
                        <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email'
                        />
                    </div>
                    {/* Password */}
                    <div>
                        {/* <label htmlFor="password">
                        Mot de passe
                        </label> */}
                        <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Password'
                        />
                    </div>
                    
                    {/* Sign in buttons */}
                    <div className="d-flex">
                        
                            <button
                            type="submit"
                            className="sign-in-btn mt-2"
                            >
                            Log in
                            </button>
                        
                    </div>
                  </form>

                  {/* Google sign in */}
                      <div>
                          <button
                          onClick={()=>signIn('google')}
                          className="sign-in-btn mt-2 mb-3"
                          >Log in with Google</button>
                      </div>

                    {/* Sign up  */}
                    <div>
                      <p>No account yet? <Link href="/auth/signup">Sign up</Link> now.</p>
                    </div>
                </div>
    </div>
                </>
            )}
        </div>
        </>
    )
}