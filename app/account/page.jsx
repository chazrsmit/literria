'use client'

import { useSession } from 'next-auth/react'

export default function Account(){

    const { data: session } = useSession()

    return(
        <>
            <div>
                {session? 
                    <h2>Welcome {session.user?.name}</h2>
                :
                    <p>Connecte-toi.</p>
                }
            </div>
        </>
    )

}