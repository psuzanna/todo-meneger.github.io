import React, { useState, useRef, useEffect, MouseEvent, useReducer } from "react";
import { useGlobalContext, Todo, State } from "../GlobalContext/GlobalContext";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getTodos } from "../../firebase";
import { validTodo } from "../../help.functions";

import styles from "./TodoAdd.module.scss";
import { update } from "firebase/database";
import { setSyntheticTrailingComments } from "typescript";
import { fileURLToPath } from "url";


interface dayType {
   year: string,
   month: string,
   day: string
}

interface TodoAddProps {
   itemId: number,
   index: number,
}

interface Payload {
   title?: string,
   description?: string,
   file: FileList,
   date: number,
   month: number,
   year: number,
   fileUrl: string
}

interface Action {
   type: string,
   payload: Payload
}
type Reducer<S, A> = (prevState: S, action: A) => S;

function reducer(state: State, action: Action) {
   let title, desctiption, file, fileUrl, date, month, year

   switch (action.type) {
      case 'title':
         title = action.payload.title;
         return {
            ...state,
            title: title
         }
         break;
      case 'description':
         desctiption = action.payload.description;
         return {
            ...state,
            description: desctiption
         }
         break;
      case 'file':
         file = action.payload.file;
         return {
            ...state,
            fileUrl: fileUrl,
            file: file
         }
         break;
      case 'date':
         date = action.payload.date;
         return {
            ...state,
            date: date
         }
         break;
      case 'month':
         month = action.payload.month;
         return {
            ...state,
            month: month
         }
         break;
      case 'year':
         year = action.payload.year;
         return {
            ...state,
            year: year
         }
         break;
      default: return state
   }

   //return state
}
export const TodoAdd: React.FC<TodoAddProps> = ({ itemId, index }) => {
   const { todos, setTodos, writeTodos, updateTodo } = useGlobalContext();

   let fullDate = dayjs()

   /*const [date, setDate] = useState<string>(String(dayjs(fullDate).format('D')))
   const [month, setMonth] = useState<string>(String(dayjs(fullDate).format('MM')))
   const [year, setYear] = useState<string>(String(dayjs(fullDate).format('YYYY')))*/
   const [addError, setAddError] = useState<boolean>(false)
   const inputTitle = useRef<HTMLInputElement>(null)
   const submitButton = useRef<HTMLButtonElement>(null)


   const [state, dispatch] = useReducer<Reducer<any, any>>(reducer, { id: todos.length, title: '', description: '', fileUrl: '', date: dayjs(fullDate).format('D'), month: dayjs(fullDate).format('M'), year: dayjs(fullDate).format('YYYY'), isComplated: false, file: '' })
   console.log(state)

   /*const changeHendlerTitle = (el: React.ChangeEvent<HTMLInputElement>) => {
      setAddError(false)
      let newValue = { ...newTodo, title: el.target.value };
      setNewTodo(newValue)
   }

   const changeHendlerDescription = (el: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = { ...newTodo, description: el.target.value };
      setNewTodo(newValue)
   }

   const changeHendlerDay = (el: React.ChangeEvent<HTMLSelectElement>) => {
      setDate(el.target.value)

   }

   const changeHendlerYear = (el: React.ChangeEvent<HTMLSelectElement>) => {
      setYear(el.target.value)
   }

   const changeHendlerMonth = (el: React.ChangeEvent<HTMLSelectElement>) => {
      setMonth(el.target.value)
   }*/
   /*const changeHendlerFile = (el: React.ChangeEvent<HTMLInputElement>) => {
      setFileName(el.target.value)
      setFile(el.target.files)
      let newValue = { ...newTodo, fileUrl: el.target.value };
      setNewTodo(newValue)
   }*/
   const clickHandler = (el: MouseEvent) => {
      el.preventDefault();
      const newDate = `${state.year}-${state.month}-${state.date}`;
      state.endDate = newDate;
      state.id = todos[0].id + 1;
      const newTodo = { ...state }
      //delete newTodo.file
      if (state.title == '') {
         console.log(inputTitle?.current?.focus())
         inputTitle?.current?.focus()
         setAddError(true)
      }
      else {
         writeTodos(newTodo)
      }
   }

   return (
      <form className={styles.todoAdd}>
         <div className="formRow">
            <label>
               Title <span>*</span>
            </label>

            <input type="text" ref={inputTitle} className={addError ? `${styles.title} ${styles.error}` : `${styles.title}`}
               onChange={(el) => {
                  dispatch({
                     type: 'title',
                     payload: {
                        title: el.target.value
                     }
                  })
               }
               }
               value={state.title} />
         </div>
         <div className="formRow">
            <label>
               Description
            </label>
            <input type="text" onChange={(el) => {
               dispatch({
                  type: 'description',
                  payload: {
                     description: el.target.value
                  }
               })
            }} value={state.description} />
         </div>
         <div className="formRow">
            <label>
               Insert file
            </label>
            <input type="file"
               onChange={(el) => {
                  dispatch({
                     type: 'file',
                     payload: {
                        //fileUrl: el.target.value,
                        file: el.target.files
                     }
                  })
               }}
            //value={state.fileUrl}
            />
         </div>
         <div className="formRow">
            <label>
               End date
            </label>

            <select value={state.date}
               onChange={(el) => {
                  dispatch({
                     type: 'date',
                     payload: {
                        date: +el.target.value
                     }
                  })
               }}
            >
               {(() => {
                  const options = [];
                  for (let i = 1; i <= 31; i++) {
                     options.push(<option value={i} key={i}>{i}</option>);
                  }
                  return options;
               })()}
            </select>
            <select value={Number(state.month)}
               onChange={(el) => {
                  dispatch({
                     type: 'month',
                     payload: {
                        month: +el.target.value
                     }
                  })
               }}
            >
               {(() => {
                  const options = [];
                  for (let i = 1; i <= 12; i++) {
                     options.push(<option value={i} key={i}>{i}</option>);
                  }
                  return options;
               })()}
            </select>
            <select value={state.year}
               onChange={(el) => {
                  dispatch({
                     type: 'year',
                     payload: {
                        year: +el.target.value
                     }
                  })
               }}
            >
               {(() => {
                  const options = [];
                  const now = new Date()
                  const nowYear = now.getFullYear()
                  for (let i = nowYear; i <= nowYear + 4; i++) {
                     options.push(<option value={i} key={i}>{i}</option>);
                  }
                  return options;
               })()}
            </select>
         </div>
         <div className="formRow t-center">
            <button ref={submitButton} className="button" onClick={clickHandler} disabled={addError} > Add </button>
         </div>

      </form>

   )
}