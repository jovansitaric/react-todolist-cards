import { createSlice } from "@reduxjs/toolkit"

export const todosSlice = createSlice({
    name: 'todo',
    initialState: {
        todos: null,
        isEditing: false
    },
    reducers: {
        setTodoData(state, action) {
            state.todos = action.payload
            localStorage.setItem('todos', JSON.stringify(action.payload))
        },
        setIsEditing(state, action) {
            state.isEditing = action.payload
        }
    }
})

export const { setTodoData, setIsEditing } = todosSlice.actions
export default todosSlice.reducer