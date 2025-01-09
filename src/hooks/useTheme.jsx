import { useContext } from "react"
import { ThemeContext } from "../context/themeContext/themeContext"

export const useTheme = () => useContext(ThemeContext)