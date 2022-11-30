import React from "react";
import { TodoEdit } from "../TodoEdit/TodoEdit";
import { Todo, useGlobalContext } from "../GlobalContext/GlobalContext";

interface ModalProps {
   itemId: number,
   todo: Todo
}

export const Modal: React.FC<ModalProps> = ({ itemId, todo }) => {

   return (
      <TodoEdit itemId={itemId} todo={todo} />
   )

}