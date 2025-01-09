import React, { useState } from 'react'
import { ThemeContext } from './themeContext'

export const ThemeProvider = ({ children }) => {
    const [isLightTheme, setIsLightTheme] = useState('light')

    const toggleTheme = (value) => {
        setIsLightTheme(() => value)
    }

    return (
        <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}