import { createSlice } from "@reduxjs/toolkit"

export const modalSlice = createSlice({
    name: 'Modal',
    initialState: {
        isOpen: false,
        modalType: null,
        modalProps: null
    },
    reducers: {
        openModal(state, action) {
            state.isOpen = true
            state.modalType = action?.payload?.modalType || null
            state.modalProps = action?.payload?.modalProps || null
        },
        closeModal: (state) => {
            state.isOpen = false
            state.modalType = null
            state.modalProps = null
        },
    }
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer