"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)
    
    // Add listener for changes
    const updateMatches = () => {
      setMatches(media.matches)
    }
    
    media.addEventListener('change', updateMatches)
    
    // Clean up
    return () => {
      media.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}

export default { useMobile, useMedia }

