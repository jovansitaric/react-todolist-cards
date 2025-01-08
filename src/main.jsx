import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Todo from "./components/Todo.jsx"
import Layout from './Layout/Layout.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/themeContext/themeProvider.jsx'
import Modal from './components/Modal.jsx'

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
          <Modal />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
