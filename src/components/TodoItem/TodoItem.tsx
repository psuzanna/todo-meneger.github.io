import React, { useEffect, useState } from "react";
import { Todo, useGlobalContext } from "../GlobalContext/GlobalContext";
import { Modal } from "../Modal/Modal";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import styles from "./TodoItem.module.scss";

interface TodoItemProps {
   todo: Todo,
   index: number
}

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
export const TodoItem: React.FC<TodoItemProps> = ({ todo, index }) => {
   const day = dayjs(new Date(todo.endDate));
   const nowDay = dayjs();
   const { removeTodo, updateTodo } = useGlobalContext();
   const [showModal, setShowModal] = useState(false);
   const [status, setStatus] = useState(todo.isComplated)

   console.log(todo)
   const removeHandler = (el: React.MouseEvent<HTMLButtonElement>) => {
      el.preventDefault();
      removeTodo(todo.id)
   }

   const showModalHandler = (el: React.MouseEvent<HTMLButtonElement>) => {
      el.preventDefault()
      setShowModal(!showModal)
   }


   useEffect(() => {
      todo.isComplated = status
      updateTodo(todo)
   }, [status])

   return (
      <li className={day.diff(nowDay, 's') < 0 && !todo.isComplated ? `${styles.item} ${styles.late}` : todo.isComplated ? `${styles.item} ${styles.isComplated}` : `${styles.item}`}>

         <div className={styles.inner}>

            <div className={styles.head}>
               <span className={styles.num}>{index + 1}</span>
               <h2 className={styles.title}>
                  {todo.title}
               </h2>
               <span className={
                  todo.isComplated ? 'todoItem__edit isComplated' :
                     !todo.isComplated && day.diff(nowDay, 's') > 0 ? 'todoItem__edit isProcessed' :
                        !todo.isComplated && day.diff(nowDay, 's') < 0 ? `todoItem__edit isLate` :
                           'editControl'
               }>{
                     todo.isComplated ?
                        <span className="isComplated">
                           <i className="fa-solid fa-check"></i>
                        </span> :
                        !todo.isComplated && day.diff(nowDay, 's') >= 0 ?
                           <span className="progress"><i className="fa-solid fa-spinner"></i></span> :
                           <span className="attantion">
                              <i className="fa-solid fa-triangle-exclamation"></i>
                           </span>
                  }
               </span>
            </div>
            <div className={styles.body}>
               <p className={styles.desc}>{todo.description}</p>
            </div>
            <div className={styles.footer}>
               {todo.fileUrl ?

                  <a href={todo?.fileUrl} className={styles.file}> File  </a>

                  : null}
               {todo.fileUrl ? <span>|</span> : null}
               <span className={styles.endDate}>{dayjs(day, 'DD MMM. YYYY').format('LL')} </span>
            </div>
         </div>
         <div className={styles.editWrapper}>
            <div className={styles.controls}>
               <button className={styles.check}
                  onClick={() => setStatus(!status)}>
                  {todo.isComplated ?
                     <i className="fa-solid fa-check"></i>
                     : null}
               </button>
               <button onClick={removeHandler} className="remove"><i className="fa-solid fa-trash"></i> </button>
               <button className="edit" onClick={showModalHandler}><i className="fa-solid fa-pen"></i></button>
            </div>
         </div>
         {showModal ?
            <Modal itemId={todo.id} todo={todo} index={index} show={showModal} />
            : null}
      </li>
   )
}