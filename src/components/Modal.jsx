import { motion, AnimatePresence } from 'motion/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../store/modal/modal'
import { errorMessages } from '../utils/constants'
import { setTodoData } from '../store/todos/todo'

const modalVariants = {
    hidden: {
        opacity: 0,
        filter: "blur(10px)"
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)"
    }
}

export default function Modal() {
    const [titleData, setTitleData] = useState('')
    const [isFirstTimeRender, setIsFirstTimeRender] = useState(true)

    const dispatch = useDispatch()

    const { isOpen, modalType } = useSelector(state => state.modal)
    const todoList = useSelector(state => state.todos.todos)

    const errorVariants = {
        toggle: {
            opacity: titleData ? 0 : 1,
            filter: titleData ? "blur(10px)" : "blur(0px)"
        }
    }
    
    setTimeout(() => {
        const todoInput = document.querySelector('#todo')
        if (todoInput && isFirstTimeRender) {
            todoInput.focus()
            setIsFirstTimeRender(false)
        }
    }, 0);

    const handleCloseModal = (e) => {
        if (e.target.tagName === "FORM" || e.target.id === 'cancelButton') {
            setTitleData('')
            dispatch(closeModal())
        }
    }

    const handleChange = (e) => {
        setTitleData(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newList = [{ id: Date.now(), todo: titleData, color: '#000' }, ...todoList]
        dispatch(setTodoData(newList))
        dispatch(closeModal())
        setTitleData('')
    }

    return (
        <AnimatePresence>
            { ( modalType === 'todo' && isOpen ) &&
                <motion.form
                    variants={modalVariants}
                    exit="hidden"
                    animate="visible"
                    initial="hidden"
                    className="modal"
                    onSubmit={(e) => handleSubmit(e)}
                    onClick={(e) => handleCloseModal(e)} >
                    <label htmlFor="todo">
                        <h2>Create card</h2>
                    </label>
                    <div className="form-control">
                        <input type="text" id='todo' placeholder='e.g. Buy groceries' onChange={(e) => handleChange(e)} />
                        <motion.span
                            variants={errorVariants}
                            animate="toggle"
                            className="modal-error">
                            { errorMessages.required }
                        </motion.span>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn success" disabled={!titleData}>Add Todo</button>
                        <button type="button" className="btn cancel" id="cancelButton">Cancel</button>
                    </div>
                </motion.form>
            }
        </AnimatePresence>
    )
}

