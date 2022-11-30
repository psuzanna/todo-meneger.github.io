import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './Global.scss';
import { GlobalContext, Todo, State } from './components/GlobalContext/GlobalContext'
import { TodoList } from './components/TodoList/TodoList';
import { TodoAdd } from './components/TodoAdd/TodoAdd';
import { validTodo } from './help.functions';
import { getDatabase, ref, set, child, get, push, update } from "firebase/database";
import { getStorage, ref as refS, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from './firebase';



const App = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const storageRef = refS(storage);
  const filesRef = refS(storageRef, 'todos');


  const uploadFile = (file: FileList, callback: Function) => {

    if (!file) return;
    const db = getDatabase();
    console.log(file[0].name)
    let fileUrl = ''
    //const spaceRef = refS(filesRef, file);
    const storageRef = refS(storage, `todos/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0]);
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL)
          fileUrl = downloadURL
          callback(fileUrl)
        });

      }
    );

  }


  /* Добавить задание */
  const writeTodos = (addTodo: Todo, file: FileList) => {
    const { id, title, description, endDate, fileUrl, isComplated } = { ...addTodo }
    const db = getDatabase();
    const data = {
      id: id,
      title: title,
      description: description,
      endDate: endDate,
      fileUrl: '',
      isComplated: false
    }
    if (file) {
      uploadFile(file, (fileUrlFb: string) => {
        set(ref(db, 'todos/' + id), { ...data, fileUrl: fileUrlFb }).then(() => {
          /*const newTodos = [
            ...todos,
            {
              ...data, fileUrl: fileUrlFb
            }
          ]
          setTodos(newTodos)*/
          async function asyncTodos() {
            const todoDB = await getTodos()
            setTodos(validTodo(todoDB))
          }
          asyncTodos()
        })
          .catch((error) => {
            // The write failed...
          });
      })
    }
    else {
      set(ref(db, 'todos/' + id), data).then((el) => {
        /*const newTodos = [
          ...todos,
          data
        ]
        setTodos(newTodos)*/

        async function asyncTodos() {
          const todoDB = await getTodos()
          setTodos(validTodo(todoDB))

        }
        asyncTodos()
        //console.log(todos, 'write', el, data.id)

      })
        .catch((error) => {
          // The write failed...
        });
    }
  }

  const getTodos = () => {
    const dbRef = ref(getDatabase());

    return (get(child(dbRef, `todos`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
    )
  };

  const updateTodo = (editTodo: Todo, file: FileList) => {
    const db = getDatabase();
    let fileUrlFb = '';
    const { id, title, description, endDate, fileUrl, isComplated } = { ...editTodo }
    console.log(editTodo, 'update');
    const todoData = {
      id: id,
      title: title,
      description: description,
      endDate: endDate,
      fileUrl: '',
      isComplated: isComplated
    };
    //const newTodoKey = push(child(ref(db), 'todos')).key;
    if (file) {

      uploadFile(file, (fileUrlFb: string) => {

        set(ref(db, 'todos/' + id), { ...todoData, fileUrl: fileUrlFb })
          .then(() => {
            /*const newTodos = [
              ...todos,
              {
                ...todoData, fileUrl: fileUrlFb
              }
            ]*/
            //setTodos(newTodos)
            async function asyncTodos() {
              const todoDB = await getTodos()
              setTodos(validTodo(todoDB))
            }
            asyncTodos()
          })
          .catch((error) => {
            // The write failed...
          });
      })
    }
    else {
      set(ref(db, 'todos/' + id), { ...todoData })
        .then(() => {
          /*const newTodos = [
            ...todos.filter(item => item.id != id), todoData
          ]*/
          //setTodos(newTodos)
          async function asyncTodos() {
            const todoDB = await getTodos()
            setTodos(validTodo(todoDB))
          }
          asyncTodos()
          console.log(todos)
        })
        .catch((error) => {
          // The write failed...
        });

    }
  }

  const removeTodo = (id: number) => {
    const db = getDatabase();
    set(ref(db, 'todos/' + id), null)
      .then(() => {
        /*const newTodos = todos.filter(item => item.id != id)
        setTodos(newTodos)*/
        async function asyncTodos() {
          const todoDB = await getTodos()
          setTodos(validTodo(todoDB))
        }
        asyncTodos()
      })
      .catch((error) => {
        // The write failed...
      });
  }



  return (
    <GlobalContext.Provider value={{ todos, setTodos, writeTodos, updateTodo, removeTodo }}>
      <div className="App" >
        <TodoAdd itemId={-1} index={-1} />
        <TodoList />
      </div>
    </GlobalContext.Provider>

  );

}

export default App;
