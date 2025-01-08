import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './todos/todo'
import modalReducer from './modal/modal'

const store = configureStore({
    reducer: {
        todos: todosReducer,
        modal: modalReducer
    }
})

export default store