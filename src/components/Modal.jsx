import { AnimatePresence } from 'motion/react'
import React from 'react'
import { useSelector } from 'react-redux'
import TodoModalContent from './modalContent/TodoModalContent'

export default function Modal() {
    const { isOpen, modalType } = useSelector(state => state.modal)

    return (
        <AnimatePresence>
            { ( modalType === 'todo' && isOpen ) &&
                <TodoModalContent />
            }
        </AnimatePresence>
    )
}

