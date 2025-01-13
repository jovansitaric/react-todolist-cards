import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Todo from "./components/todo/Todo"
import Layout from './Layout/Layout'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/themeContext/themeProvider'
import Modal from './components/modal/Modal'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              {/* <Route index element={<App />}></Route> */}
              <Route path="/react-todolist-cards/" element={<Todo />}></Route>
            </Route>
          </Routes>
          <Toaster />
          <Modal />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
