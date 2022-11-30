import React, { useEffect, useState } from "react";
import { TodoItem } from '../TodoItem/TodoItem';
import { useGlobalContext, Todo } from "../GlobalContext/GlobalContext";
import { getTodos } from "../../firebase";
import { validTodo } from "../../help.functions";
import styles from "./TodoList.module.scss";


export const TodoList = () => {
   const { todos, setTodos } = useGlobalContext();

   useEffect(() => {
      async function asyncTodos() {
         const todoDB = await getTodos()
         setTodos(validTodo(todoDB))
      }
      asyncTodos()

   }, [])
   return (
      <ul className={styles.list}>
         {
            todos.reverse().map((todo: Todo, index) => {
               return (
                  <TodoItem todo={todo} key={index} index={index} />
               )
            })
         }
      </ul>
   )

}


