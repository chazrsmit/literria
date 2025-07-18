'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../auth.css'
import '../../components/searchbar'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords not matching.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Success with account creation! You can now log in.')
        router.push('/auth')
      } else {
        setError(data.error || 'Error')
      }
    } catch (error) {
      setError('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        {/* <div>
          <h2>
            Create an account
          </h2>
        </div> */}

<div className="page-auth">
        <div className="auth signup">
        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              {error}
            </div>
          )}
          
          <div>
            {/* <label htmlFor="name">
              Username
            </label> */}
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder='Name'
            />
          </div>

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

          <div>
            {/* <label htmlFor="password">
              Password
            </label> */}
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
            />
          </div>

          <div>
            {/* <label htmlFor="confirmPassword">
              Confirm password
            </label> */}
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="confirm password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="sign-in-btn my-2"
            >
                Submit
            </button>
          </div>

          <div>
            <p>
              Already have an account?{' '}
              <Link href="/auth">
                Log in
              </Link>
            </p>
          </div>
        </form>
        </div>
        </div>
      </div>
    </div>
  )
}