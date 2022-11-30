import { createContext, useContext } from "react"
import { DragEventHandler, EffectCallback, MouseEventHandler, useEffect, useState, SetStateAction, Dispatch } from 'react';

export interface Todo {
   id: number,
   title: string,
   description: string,
   fileUrl: string,
   endDate: string,
   isComplated: boolean,
}

export interface State {
   id?: number | undefined,
   title?: string,
   description?: string,
   fileUrl?: string,
   date: number,
   month: number,
   year: number,
   isComplated: boolean,
   file: FileList
}

export type GlobalContent = {
   todos: Todo[],
   setTodos: Dispatch<SetStateAction<Todo[]>>,
   writeTodos: Function,
   updateTodo: Function,
   removeTodo: Function,
}

export const GlobalContext = createContext<GlobalContent>({
   todos: [],
   setTodos: ((s) => s),
   writeTodos: (({ }) => { }),
   updateTodo: (({ }) => { }),
   removeTodo: (({ }) => { }),
})

export const useGlobalContext = () => useContext(GlobalContext)