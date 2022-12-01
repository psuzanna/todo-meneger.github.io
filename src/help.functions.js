export const dayConstructor = () => {
   let resault = ''
   for (let i = 1; i <= 31; i++) {
      resault += `<option value="${i}">${i}</option>`
   }
   return resault
}

export const monthConstructor = () => {
   let resault = []
   for (let i = 1; i <= 12; i++) {
      resault.push(`<option value="${i}">${i}</option>`)
   }
   console.log(resault, this)
   return resault
}

export const yearConstructor = () => {
   const now = new Date()
   const nowYear = now.getFullYear()
   let resault = ''
   for (let i = nowYear; i <= nowYear + 4; i++) {
      resault += `<option value="${i}">${i}</option>`
   }
   return resault
}

export const validTodo = (todo) => {
   const validTodo = []
   for (let key in todo) {
      validTodo.push({
         id: todo[key].id,
         title: todo[key].title,
         description: todo[key].description,
         fileUrl: todo[key].fileUrl,
         endDate: todo[key].endDate,
         isComplated: todo[key].isComplated,
         file: todo[key].file

      })
   }
   return validTodo
}