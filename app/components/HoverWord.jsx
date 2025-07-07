'use client'

import { useState } from 'react'

export default function HoverWord ({ word }) {
    const [italicIndex, setItalicIndex] = useState(null)

    const getLetterIndexes = (str) => {
        const letterIndexes = []
        for (let i = 0 ; i < str.length ; i++) {
            // ci-dessous, retourne un true s'il s'agit d'une lettre; retourne un false si c'est autre chose
            if (/[a-zA-Z]/.test(str[i])) {
                letterIndexes.push(i)
            }
        }
        return letterIndexes
    }

    const handleMouseEnter = () => {
        const letterIndexes = getLetterIndexes(word)
        //  on check qu'il y a bien des lettres, sinon on quitte la fonction avec 'return' :
        if (letterIndexes.length === 0) return
        const random = Math.floor(Math.random()*letterIndexes.length)
        setItalicIndex(letterIndexes[random])
    }

    const handleMouseLeave = () => {
        setItalicIndex(null)
    }

    return (
        <p className="nav-word" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {word.split('').map((char, index) => (
                <span key={index} className={index === italicIndex ? 'italic-letter' : ''}>
                    {char}
                </span>
            ) )}
        </p>
    )
}