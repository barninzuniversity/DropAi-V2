import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that scrolls the window to the top
 * whenever the route changes. This ensures that when users
 * navigate between pages, they start at the top of the new page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top when the pathname changes
    window.scrollTo(0, 0)
  }, [pathname])

  return null // This component doesn't render anything
}

export default ScrollToTop