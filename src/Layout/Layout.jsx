import React from "react"
import { Outlet } from "react-router-dom"
import ThemeSwitcher from "../components/ThemeSwitcher"

export default function Layout() {
    return (
        <div className={`app-container`}>
            <main>
                <Outlet />
            </main>
            {/* <ThemeSwitcher /> */}
        </div>
    )
}
