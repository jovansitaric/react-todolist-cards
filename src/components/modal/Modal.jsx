import { motion, AnimatePresence } from 'motion/react'
import React from 'react'
import { useSelector } from 'react-redux'
import TodoModalContent from './TodoModalContent'

const variants = {
    visible: {
        opacity: 1,
        filter: 'blur(0px)'
    },
    hidden: {
        opacity: 0,
        filter: 'blur(3px)'
    }
}

export default function Modal() {
    const { isOpen, modalType } = useSelector(state => state.modal)

    return (
        <AnimatePresence>
            { 
                modalType === 'todo' && isOpen ? (
                    <TodoModalContent />
                ) : !modalType && isOpen ? (
                    <motion.div
                        animate="visible"
                        initial="hidden"
                        exit="hidden"
                        variants={variants}
                        className="modal"
                        id="modalContainer">
                    </motion.div>
                ) : null
            }
        </AnimatePresence>
    )
}

