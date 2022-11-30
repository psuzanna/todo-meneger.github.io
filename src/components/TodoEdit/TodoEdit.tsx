import React, { useState, SetStateAction, Dispatch, useEffect, useRef, MouseEvent, EffectCallback, useReducer } from "react";
import { useGlobalContext, Todo, State } from "../GlobalContext/GlobalContext";
import { RecordWithTtl } from "dns";
import { getTodos, writeTodos, updateTodo } from "../../firebase";
import { validTodo } from "../../help.functions";
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import styles from "../TodoEdit/TodoEdit.module.scss"

/*interface dayType {
   year: string,
   month: string,
   day: string
}*/

interface TodoEditProps {
   itemId: number,
   //index: number,
   todo: Todo,
   //endDate: Dayjs
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
}
export const TodoEdit: React.FC<TodoEditProps> = ({ itemId, todo }) => {

   const { todos, setTodos, writeTodos, updateTodo } = useGlobalContext();
   let fullDate = dayjs(todo.endDate)
   let realId = itemId
   const [state, dispatch] = useReducer<Reducer<any, any>>(reducer, { id: realId, title: '', description: '', fileUrl: '', date: dayjs(fullDate).format('D'), month: dayjs(fullDate).format('M'), year: dayjs(fullDate).format('YYYY'), isComplated: false, file: '' })
   console.log(state)
   /*const [date, setDate] = useState<string>(String(dayjs(todo.endDate).format('D')))
   const [month, setMonth] = useState<string>(String(dayjs(todo.endDate).format('M')))
   const [year, setYear] = useState<string>(String(dayjs(todo.endDate).format('YYYY')))
 
   const [newTodo, setNewTodo] = useState<Todo>({ id: todos.length, title: '', description: '', fileUrl: '', endDate: '', isComplated: false });
   const [fileName, setFileName] = useState<string>('')
   const [file, setFile] = useState<FileList | null>()*/
   const [addError, setAddError] = useState<boolean>(false)
   const inputTitle = useRef<HTMLInputElement>(null)
   const submitButton = useRef<HTMLButtonElement>(null)
   const [status, setStatus] = useState(todo.isComplated)

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
   }
   const changeHendlerFile = (el: React.ChangeEvent<HTMLInputElement>) => {
      setFileName(el.target.value)
      setFile(el.target.files)
      let newValue = { ...newTodo, fileUrl: el.target.value };
      setNewTodo(newValue)
   }
   const statusChangeHendler = (el: React.ChangeEvent<HTMLInputElement>) => {
      el.preventDefault();
      setStatus(!status);
      console.log(status)
   }*/

   const editTodo = () => {
      const newDate = `${state.year}-${state.month}-${state.date}`;
      state.endDate = newDate;

      if (state.title == '') {
         state.title = todo.title
      }
      if (state.description == '') {
         state.description = todo.description
      }
      if (state.endDate == '') {
         state.endDate = todo.endDate;
      }
      if (state.fileUrl == '') {
         state.fileUrl = todo.fileUrl;
      }
      const editTodo = { ...state }
      delete editTodo.file
      updateTodo(editTodo, state.file)
   }

   const clickHandler = (el: MouseEvent) => {
      el.preventDefault();
      editTodo()
   }

   /*useEffect(() => {
      setDate(dayjs(todo.endDate).format('D'))
      setMonth(dayjs(todo.endDate).format('M'))
      setYear(dayjs(todo.endDate).format('YYYY'))
   }, [todo]);*/
   useEffect(() => {
      editTodo()
   }, [status]);
   return (
      <form className={styles.todoAdd}>
         <div className={styles.row}>
            <label>
               Названиe <span>*</span>{itemId}
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
         <div className={styles.row}>
            <label>
               Описание
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
         <div className={styles.row}>
            <label>
               Прикрепить файл
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
         <div className={styles.row}>
            <label>
               Дата завершения
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
            <select value={state.month}
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
         <button ref={submitButton} className="todoAdd__button" onClick={clickHandler} disabled={addError}> Add </button>
      </form>

   )
}