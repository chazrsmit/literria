import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const usersFilePath = path.join(process.cwd(), 'data', 'users.json')


const ensureDataDirectory = () => {
  const dataDir = path.dirname(usersFilePath)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}


const readUsers = () => {
  ensureDataDirectory()
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}


const writeUsers = (users) => {
  ensureDataDirectory()
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users:', error)
  }
}


export const createUser = async (email, password, name) => {
  const users = readUsers()
  
  
  const existingUser = users.find(user => user.email === email)
  if (existingUser) {
    throw new Error('User already exists')
  }
  
  
  const hashedPassword = await bcrypt.hash(password, 12)
  
  
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  writeUsers(users)
  

  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}


export const verifyUser = async (email, password) => {
  const users = readUsers()
  const user = users.find(user => user.email === email)
  
  if (!user) {
    return null
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return null
  }
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export const getUserByEmail = (email) => {
  const users = readUsers()
  const user = users.find(user => user.email === email)
  
  if (!user) {
    return null
  }
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}