'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function AuthPage() {

    const { data: session } = useSession()

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
                    <p>Non Connecté</p>
                    <button>Sign up</button>
                    <button onClick={()=>signIn('google')}>Sign in with Google</button>
                </>
            )}
        </div>
        </>
    )
}