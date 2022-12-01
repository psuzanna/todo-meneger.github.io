import React from "react";
import { TodoAdd } from "../TodoAdd/TodoAdd";
import logo from "../../logo.png";

import styles from "./TodoHead.module.scss";

export const TodoHead = () => {
   return (
      <header className={styles.header}>
         <h1 className={styles.logo}>
            <img src={logo} />
         </h1>
         <TodoAdd itemId={-1} index={-1} />
      </header>
   )
}  