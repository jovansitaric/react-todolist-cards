import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { setTodoData } from '../store/todos/todo'
import Loader from "./Loader"

import fontColorContrast from 'font-color-contrast'
import { CheckIcon, CloseIcon, ColorIcon, EditIcon } from "./Icons"

const todoBgColor = '#e7ad40'

const getLocalTodos = () => JSON.parse(localStorage.getItem('todos')) || []
const setLocalTodoList = (todoList) => localStorage.setItem('todos', JSON.stringify(todoList))

const variants = {
    visible: (customDelay) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: customDelay * 0.1,
            duration: 0.5,
        },
    }),
    hidden: { opacity: 0, y: -20 },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
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

export default function Todo() {
    const todoList = useSelector(state => state.todos.todos)

    const [tempText, setTempText] = useState('')
    const [currentText, setCurrentText] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (getLocalTodos().length > 0)
            dispatch(setTodoData(getLocalTodos()))
        else {
            fetch('https://dummyjson.com/todos')
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

    const setTodos = (todo) => {
        dispatch(setTodoData(todo))
        setLocalTodoList(todo)
    }

    const addTodo = () => {
        const newList = [{id: Date.now(), todo: 'title'}, ...todoList]
        setTodos(newList)
    }

    const editTodo = (e, currentTodo) => {
        const currentText = e.target.parentNode.parentNode.querySelector('#todoTitle')?.innerText
        if (currentText) {
            setCurrentText(currentText)
            setTempText(currentText)
        }

        e.target.style.pointerEvents = 'all'

        if (!currentTodo.isEditing) { // it's reversed since we still didn't switched editing
            setTimeout(() => { // for some reason (I suspect rendering of input), select works, but produces no result. After settimeout delay, it's ok
                setIsEditing(true)
                const currentInput = e.target.parentNode.parentNode.querySelector('#todoInput')
                currentInput.select()
            }, 0);
        } else
            setIsEditing(false)

        const newList = todoList.map(todo =>
            todo.id === currentTodo.id ? { ...todo, isEditing: !todo.isEditing } : todo
        )
        setTodos(newList)
    }

    const saveEdit = (e, id) => {
        const currentTitle = e.target.parentNode.parentNode.querySelector('#todoInput').value
        const newList = todoList.map(todo => todo.id === id
            ? { ...todo, todo: currentTitle, isEditing: false }
            : todo
        )
        setIsEditing(false)
        setTodos(newList)
    }

    const cancelEdit = (e, id) => {
        const newList = todoList.map(todo => todo.id === id
            ? { ...todo, todo: currentText, isEditing: false }
            : todo
        )
        setTodos(newList)
        setIsEditing(false)
    }

    const colorTodo = (e) => {
        const colorPicker = e.target.querySelector('#colorPicker')
        if (colorPicker)
            colorPicker.click()
        e.target.blur()
    }

    const handleColorChange = (e, id) => {
        const newList = todoList.map(todo => todo.id === id
                ? { ...todo, bgColor: e.target.value, color: fontColorContrast(e.target.value) }
                : todo
        )
        setTodos(newList)
    }

    const completeTodo = (e, id) => {
        const newList = todoList.map(todo => todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
        e.target.blur()
        setTodos(newList)
    }

    const removeTodo = (id) => {
        const newList = todoList.filter(todo => todo.id != id)
        setTodos(newList)
    }

    const handleTodoTitleChange = (e) => {
        setTempText(e.target.value)
    }

    return (
        <>
            <h1>Sticky Cards TodoList</h1>
            { hasTodos ? (
                <ul className="cards">
                    <AnimatePresence>
                        { todoList.map((todo, i) => (
                            <motion.li
                                whileHover="hover"
                                whileTap="hover"
                                layout
                                className={`card ${todo.completed ? 'completed' : ''}`}
                                style={{
                                    backgroundColor: todo.completed ? '#373f3f' : todo.bgColor,
                                    color: fontColorContrast(todo.bgColor),
                                    pointerEvents: isEditing && !todo.isEditing ? 'none' : 'all'
                                }}
                                key={ todo.id }
                                variants={variants}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition="transition">
                                <div>
                                    { todo.isEditing ? (
                                        <input
                                            type="text"
                                            id="todoInput"
                                            className="todo-input"
                                            value={tempText}
                                            onKeyDown={e => handleKeyPress(e)}
                                            onChange={e => handleTodoTitleChange(e)}
                                        />
                                    ) : (
                                        <p id="todoTitle">{ todo.todo }</p>
                                    )}
                                </div>
                                <div className='todo-actions'>
                                    <button type="button" className="icon icon-check" onClick={(e) => isEditing ? saveEdit(e, todo.id) : completeTodo(e, todo.id)}>
                                        <CheckIcon />
                                    </button>
                                    { ( !todo.completed && !isEditing ) &&
                                    <>
                                        <button type="button" className="icon icon-edit" onClick={(e) => editTodo(e, todo)}>
                                            <EditIcon />
                                        </button>
                                        <button type="button" className="icon icon-color" onClick={(e) => colorTodo(e, todo.id)}>
                                            <input id="colorPicker" className="hidden" type="color" tabIndex={-1} value={todoBgColor} onChange={(e) => handleColorChange(e, todo.id)} />
                                            <ColorIcon />
                                        </button>
                                    </>
                                    }
                                    <button type="button" className="icon icon-close" onClick={(e) => isEditing ? cancelEdit(e, todo.id) : removeTodo(todo.id)}>
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
        </>
    )
}
