import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './todos/todo'

const store = configureStore({
    reducer: {
        todos: todosReducer
    }
})

export default store