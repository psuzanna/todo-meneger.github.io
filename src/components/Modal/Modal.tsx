import React, { useState } from "react";
import { TodoEdit } from "../TodoEdit/TodoEdit";
import { Todo, useGlobalContext } from "../GlobalContext/GlobalContext";
import styles from "./Modal.module.scss"

interface ModalProps {
   itemId: number,
   todo: Todo,
   index: number,
   show: boolean
}

export const Modal: React.FC<ModalProps> = ({ itemId, todo, index, show }) => {
   const [showModal, setShowModal] = useState(show)


   if (!showModal) return null
   return (
      <div className={styles.content}>
         <button className={styles.close} onClick={() => { setShowModal(false) }}>
            <i className="fa-solid fa-xmark"></i>
         </button>
         <TodoEdit itemId={itemId} todo={todo} index={index} />
      </div>

   )

}