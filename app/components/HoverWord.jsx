'use client'

import { useState, useEffect } from 'react'

export default function HoverWord ({ word, animate }) {
    const [italicIndex, setItalicIndex] = useState(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

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

    const animateRandomLetter = () => {
        const letterIndexes = getLetterIndexes(word)
        if (letterIndexes.length === 0) return

        const random = Math.floor(Math.random()*letterIndexes.length)
        setItalicIndex(letterIndexes[random])
    }

    // animation qui va commencer lorsque le component va mount (au chargement de la page):
    useEffect(() => {
        if (animate && !isHovered) {
            setIsAnimating(true)
            // on lance alors la fonction:
            animateRandomLetter()
            // on anime une lettre toutes les 0.3s:
            const animationInterval = setInterval(()=>{
                animateRandomLetter()
            }, 200)
            // et on arrête après 5s:
            const animationTimeout = setTimeout(()=>{
                setIsAnimating(false)
                setItalicIndex(null)
                clearInterval(animationInterval)
            }, 3000)
            // cleanup
            return () => {
                clearInterval(animationInterval)
                clearTimeout(animationTimeout)
            }
        }
    } , [])

    const handleMouseEnter = () => {
        // quand on hover sur le titre, l'animation stop:
        setIsHovered(true)
        if (isAnimating) {
            setIsAnimating(false)
        }

        // hover effect
        const letterIndexes = getLetterIndexes(word)
        //  on check qu'il y a bien des lettres, sinon on quitte la fonction avec 'return' :
        if (letterIndexes.length === 0) return
        const random = Math.floor(Math.random()*letterIndexes.length)
        setItalicIndex(letterIndexes[random])
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
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