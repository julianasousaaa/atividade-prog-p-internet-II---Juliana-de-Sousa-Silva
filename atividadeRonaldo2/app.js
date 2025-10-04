const fs = require("fs") 
const express = require('express');
const app = express();

const v4 = require('uuid').v4

app.set("view engine", "ejs") 
app.use(express.urlencoded({extended: true})) 
app.use(express.static("public")) 

const loadTask = ()=>{ 
    try{
      const data = fs.readFileSync('tasks.json')
      return JSON.parse(data)  
    }catch(err){
        console.log(`Algo saiu errado: ${err}`)
    }
}

const saveTasks = (tasks)=>{
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 4))
    console.log('Arquivo tasks.json atualizado.')
}


app.get("/", (req, res) => {
    res.redirect("/tasks"); 
});

app.get("/tasks",(req,res)=>{
    const tasks = loadTask() 
    res.render("index",{tasks});
})

app.get("/newTask", (req,res)=>{
    res.render("newTask")
})

app.post("/tasks",(req,res)=>{
    const tasks = loadTask() 
    const newTask = {
        id: v4(),
        title: req.body.title,
        completed: false
    }
    tasks.push(newTask)
    saveTasks(tasks)
    res.redirect("/tasks")
})

app.get("/delTasks/:id", (req, res)=>{
    let tasks = loadTask() 
    const taskId = req.params.id
    tasks = tasks.filter(task => task.id != taskId) 
    saveTasks(tasks)
    res.redirect("/tasks")
})

app.get("/tasks/:id", (req, res)=>{
    const taskId = req.params.id
    const tasks = loadTask() 
    const task = tasks.find(task => task.id == taskId) 
                
    if (task){
        task.completed = true
        saveTasks(tasks)
    }else console.log("sem task?")
    res.redirect("/tasks")
})

const PORT = 3000;
app.listen(PORT,(err)=>{
    if(!err)
        console.log(`Servidor onlin: http://localhost:${PORT}`);
    else 
        console.log(`Erro:${PORT}`)
})