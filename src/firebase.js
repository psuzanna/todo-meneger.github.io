

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, child, get, push, update } from "firebase/database";
import { getStorage, ref as refS, getDownloadURL, uploadBytesResumable } from "firebase/storage";


const firebaseConfig = {
   apiKey: process.env.REACT_APP_APIKEY,
   authDomain: process.env.REACT_APP_DOMAIN,
   projectId: process.env.REACT_APP_PROJECTID,
   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
   appId: process.env.REACT_APP_APPID,
   measurementId: process.env.REACT_APP_MEASUREMENTID,
   databaseURL: "https://todolist-6c60a-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
export const storage = getStorage(app);
const storageRef = refS(storage);
const filesRef = refS(storageRef, 'todos');


export const writeTodos = (id, title, description, endDate, fileUrl, isComplated, file) => {
   const db = getDatabase();
   console.log(db)
   let fileUrlFb = '';
   console.log(file, 'write');
   if (file) {
      uploadFile(file, (fileUrlFb) => {
         set(ref(db, 'todos/' + id), {
            id: id,
            title: title,
            description: description,
            endDate: endDate,
            fileUrl: fileUrlFb,
            isComplated: false
         })
      })
   }
   else {
      console.log(id);
      set(ref(db, 'todos/' + id), {
         id: id,
         title: title,
         description: description,
         endDate: endDate,
         fileUrl: '',
         isComplated: false
      })
   }

   /*console.log(file[0].name)
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
            fileUrlFb = downloadURL
            set(ref(db, 'todos/' + id), {
               id: id,
               title: title,
               description: description,
               endDate: endDate,
               fileUrl: fileUrlFb,
               isComplated: false
            })
         });
      }
   );*/

}


export const getTodos = () => {
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

export const updateTodo = (id, title, description, endDate, fileName, isComplated, file) => {
   const db = getDatabase();
   let fileUrl = '';
   console.log(file)
   //const newTodoKey = push(child(ref(db), 'todos')).key;
   if (file) {
      uploadFile(file, (fileUrl) => {
         const todoData = {
            id: id,
            title: title,
            description: description,
            endDate: endDate,
            fileUrl: fileUrl,
            isComplated: false
         };
         const updates = {};
         updates['/todos/' + id] = todoData;
         return update(ref(db), updates);
      })
   }
   else {
      const todoData = {
         id: id,
         title: title,
         description: description,
         endDate: endDate,
         fileUrl: '',
         isComplated: false
      };
      const updates = {};
      updates['/todos/' + id] = todoData;
      return update(ref(db), updates);
   }
   /*const storageRef = refS(storage, `todos/${file[0].name}`);
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
         });
         const todoData = {
            id: id,
            title: title,
            description: description,
            endDate: endDate,
            fileUrl: fileUrl,
            isComplated: false
         };
         const updates = {};
         updates['/todos/' + id] = todoData;
         return update(ref(db), updates);
      }
   );*/

}

export const removeTodo = (id) => {
   const db = getDatabase();
   const updates = {};
   updates['/todos/' + id] = null;
   return update(ref(db), updates);
}

const uploadFile = (file, callback) => {

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