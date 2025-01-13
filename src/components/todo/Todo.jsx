import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { setTodoData, setIsEditing } from '../../store/todos/todo'
import Loader from '../Loader'

import fontColorContrast from 'font-color-contrast'
import { CheckIcon, CloseIcon, ColorIcon, EditIcon, PlusIcon, ReloadIcon } from '../icons/Icon.jsx'
import { openModal, closeModal } from '../../store/modal/modal'
import { colors, toastMessages } from '../../utils/constants'
import toast from 'react-hot-toast'

const { todoBgColor } = colors

const getLocalTodos = () => JSON.parse(localStorage.getItem('todos')) || []

const variants = {
    visible: (customDelay) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0)",
        transition: {
            delay: customDelay * 0.1,
            duration: 0.5,
        },
    }),
    hidden: {
        opacity: 0,
        filter: "blur(5px)",
        y: -20
    },
    exit: {
        opacity: 0,
        y: 20,
        filter: "blur(5px)",
        transition:
            { duration: 0.5 }
    },
    hover: {
        scale: [ null, 1.05, 1 ],
        transition: {
            duration: .5,
        }
    },
    transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: .3,
        scale: {
            type: "spring",
            stiffness: 250,
            damping: 15
        }
    }
}

const floatingButtonVariants = {
    hover: {
        rotate: 180,
        transition: { duration: .5 }
    },
    tap: {
        scale: .9
    }
}

export default function Todo() {
    const {todos: todoList, isEditing } = useSelector(state => state.todos)

    const [tempText, setTempText] = useState('')
    const [currentText, setCurrentText] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        if (getLocalTodos().length > 0)
            dispatch(setTodoData(getLocalTodos()))
        else {
            fetch('https://dummyjson.com/todos/?limit=5')
                .then(res => res.json())
                .then(json => {
                    const updatedTodos = json.todos.map(todo => ({
                        ...todo,
                        bgColor: todoBgColor,
                        color: fontColorContrast(todoBgColor),
                        isEditing: false
                    }))
                    dispatch(setTodoData(updatedTodos))
            })
        }
    }, [])

    const hasTodos = useMemo(
        () => todoList?.length > 0,
        [JSON.stringify(todoList?.length)]
    )

    const editTodo = (e, currentTodo) => {
        const currentText = e.target.parentNode.parentNode.querySelector('#todoTitle')?.innerText
        const todoElementCard = e.target.parentNode.parentNode
        const todoContainer = document.querySelector('.js-cards')

        todoContainer.childNodes.forEach(todo => todo.style.zIndex = '0')
        todoElementCard.style.zIndex = '2'
        
        if (currentText) {
            setCurrentText(currentText)
            setTempText(currentText)
        }

        const newList = todoList.map(todo =>
            todo.id === currentTodo.id 
                ? { ...todo, isEditing: !todo.isEditing } 
                : todo
        )
        dispatch(setTodoData(newList))
        dispatch(openModal())

        if (!currentTodo.isEditing) { // it's reversed since we still didn't switched editing
            setTimeout(() => { // due to rendering of input, select works, but produces no result. After settimeout delay, it's ok
                dispatch(setIsEditing(true))
                const currentInput = e.target.parentNode.parentNode.querySelector('#todoInput')
                
                currentInput.focus()
                currentInput.select()
            }, 0) 
        } else
            dispatch(setIsEditing(false))
    }

    const saveEdit = (e, id) => {
        const currentTitle = e.target.parentNode.parentNode.querySelector('#todoInput').value
        const newList = todoList.map(todo => todo.id === id
            ? { ...todo, todo: currentTitle, isEditing: false }
            : todo
        )
        dispatch(setIsEditing(false))
        dispatch(setTodoData(newList))
        dispatch(closeModal())

        if (tempText !== currentText)
            toast.success(toastMessages.todo.edit)
    }

    const cancelEdit = (id) => {
        const newList = todoList.map(todo => todo.id === id
            ? { ...todo, todo: currentText, isEditing: false }
            : todo
        )
        dispatch(setIsEditing(false))
        dispatch(setTodoData(newList))
        dispatch(closeModal())
    }

    const colorTodo = (e) => {
        const colorPickerLabel = e.target.querySelector('#colorPickerLabel')
        if (colorPickerLabel)
            colorPickerLabel.click()
        e.target.blur()
        // toast.success(toastMessages.todo.color)
    }

    const handleColorChange = (e, id) => {
        const newList = todoList.map(todo => todo.id === id
                ? { ...todo, bgColor: e.target.value, color: fontColorContrast(e.target.value) }
                : todo
        )
        dispatch(setTodoData(newList))
    }

    const completeTodo = (e, id) => {
        const newList = todoList.map(todo => todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
        const isCurrentTodoCompleted = todoList.find(todo => todo.id === id && !todo.completed) // reversed
        e.target.blur()
        dispatch(setTodoData(newList))

        if (isCurrentTodoCompleted)
            toast.success(toastMessages.todo.completed)
    }

    const removeTodo = (id) => {
        const newList = todoList.filter(todo => todo.id != id)
        dispatch(setTodoData(newList))
        toast.success(toastMessages.todo.remove)
    }

    const handleTodoTitleChange = (e) => {
        setTempText(e.target.value)
    }

    return (
        <>
            <h1>Sticky Cards TodoList</h1>
            { hasTodos ? (
                <ul className="cards js-cards">
                    <AnimatePresence>
                        { todoList.map((todo, i) => (
                            <motion.li
                                whileHover="hover"
                                whileTap="hover"
                                layout
                                className={`card ${todo.completed ? 'completed' : ''}`}
                                style={{
                                    backgroundColor: todo.completed ? '#373f3f' : todo.bgColor,
                                    color: todo.color || fontColorContrast(todo.bgColor),
                                    pointerEvents: isEditing && !todo.isEditing ? 'none' : 'all'
                                }}
                                key={ todo.id }
                                variants={variants}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition="transition">
                                <div className="todo-input-container">
                                    { todo.isEditing ? (
                                        <input
                                            type="text"
                                            id="todoInput"
                                            className="todo-input"
                                            value={tempText}
                                            onChange={e => handleTodoTitleChange(e)}
                                        />
                                    ) : (
                                        <p id="todoTitle">{ todo.todo }</p>
                                    )}
                                </div>
                                <div className='todo-actions'>
                                    <button type="button" className="icon icon-check" onClick={(e) => isEditing ? saveEdit(e, todo.id) : completeTodo(e, todo.id)}>
                                        { todo.completed ? (
                                            <ReloadIcon />
                                        ) : (
                                            <CheckIcon />
                                        )}
                                    </button>
                                    { ( !todo.completed && !isEditing ) &&
                                    <>
                                        <button type="button" className="icon icon-edit" onClick={(e) => editTodo(e, todo)}>
                                            <EditIcon />
                                        </button>
                                        <button type="button" className="icon icon-color" onClick={(e) => colorTodo(e, todo.id)}>
                                            <label htmlFor="colorPicker" id="colorPickerLabel"></label>
                                            <input id="colorPicker" className="hidden" type="color" tabIndex={-1} value={todoBgColor} onChange={(e) => handleColorChange(e, todo.id)} />
                                            <ColorIcon />
                                        </button>
                                    </>
                                    }
                                    <button type="button" className="icon icon-close" onClick={() => isEditing ? cancelEdit(todo.id) : removeTodo(todo.id)}>
                                        <CloseIcon />
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            ) : (
                <Loader />
            )}
            <motion.button
                variants={floatingButtonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                className="icon addTodo icon-plus"
                onClick={() => dispatch(openModal({ modalType: 'todo' }))}>
                <PlusIcon />
            </motion.button>
        </>
    )
}
