'use client'

import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

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
        <div>
            {session ? (
            <>
                <p>Connecté en tant que {session.user?.name}</p>
                <button onClick={()=>signOut()}>Log out</button>
            </>
            )
            : (
                <>
                <div className="d-flex flex-column">
                {/* Sign in */}
                    <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label htmlFor="email">
                        Email
                        </label>
                        <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label htmlFor="password">
                        Mot de passe
                        </label>
                        <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        />
                    </div>
                    {/* Sign in buttons */}
                    <div className="d-flex">
                        <div>
                            <button
                            type="submit"
                            >
                            Sign in
                            </button>
                        </div>
                    </div>

                    </form>
                                            {/* Google sign in */}
                        <div>
                            <button onClick={()=>signIn('google')}>Sign in with Google</button>
                        </div>
                                            {/* Sign up page */}
                    <Link href="/auth/signup"><button>Sign up</button></Link>
                </div>

                </>
            )}
        </div>
        </>
    )
}