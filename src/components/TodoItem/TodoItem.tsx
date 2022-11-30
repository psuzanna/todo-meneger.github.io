import React, { useState } from "react";
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
   const { removeTodo } = useGlobalContext();
   const [showModal, setShowModal] = useState(false)

   const removeHandler = (el: React.MouseEvent<HTMLButtonElement>) => {
      el.preventDefault();
      removeTodo(todo.id)
   }

   const showModalHandler = (el: React.MouseEvent<HTMLButtonElement>) => {
      el.preventDefault()
      setShowModal(!showModal)
   }

   return (
      <li className={day.diff(nowDay, 's') < 0 && !todo.isComplated ? `${styles.item} ${styles.late}` : `${styles.item}`}>


         <div className={styles.inner}>
            <span className={styles.num}>{index}</span>
            <div className={styles.head}>
               <h2 className={styles.name}>
                  {todo.title}
               </h2>
               <span>{dayjs(day, 'ДД МММ. ГГГГ', 'ru').format('LL')} </span>
            </div>

            <p className={styles.desc}>{todo.description}</p>

            <a href={todo?.fileUrl} className={todo.fileUrl ? `styles.todoItem__file showFile` : `styles.todoItem__file`}>Файл</a>

         </div>
         <div className={styles.editWrapper}>
            <div className="todoItem__controls">
               <span className={
                  todo.isComplated ? 'todoItem__edit isComplated' :
                     !todo.isComplated && day.diff(nowDay, 's') > 0 ? 'todoItem__edit isProcessed' :
                        !todo.isComplated && day.diff(nowDay, 's') < 0 ? `todoItem__edit isLate` :
                           'editControl'
               }>{
                     todo.isComplated ? 'Завершён' :
                        !todo.isComplated && day.diff(nowDay, 's') >= 0 ? 'В работе' : 'Дата истекла'
                  }
               </span>
               <button onClick={removeHandler}>remove {index}</button>
               <button className={styles.edit} onClick={showModalHandler}>Edit</button>
            </div>
         </div>
         {showModal ?
            <Modal itemId={todo.id} todo={todo} />
            : null}
      </li>
   )
}