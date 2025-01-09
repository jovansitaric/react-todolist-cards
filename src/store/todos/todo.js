import { createSlice } from "@reduxjs/toolkit"

export const todosSlice = createSlice({
    name: 'todo',
    initialState: {
        todos: null,
        loading: false,
        error: null
    },
    reducers: {
        setTodoData(state, action) {
            state.todos = action.payload
            localStorage.setItem('todos', JSON.stringify(action.payload))
        },
        setError(state, action) {
            state.error = action.payload
        },
    }
})

export const { setTodoData, setError } = todosSlice.actions
export default todosSlice.reducer