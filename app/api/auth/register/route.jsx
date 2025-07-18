import { NextResponse } from 'next/server'
import { createUser } from '@/app/lib/users'

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'The password must contain at least 6 characters.' },
        { status: 400 }
      )
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email.' },
        { status: 400 }
      )
    }
    
    const user = await createUser(email, password, name)
    
    return NextResponse.json(
      { message: 'User created with success!', user },
      { status: 201 }
    )
    
  } catch (error) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'This email is already used.' },
        { status: 409 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error' },
      { status: 500 }
    )
  }
}