import { useState } from "react"
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Swal from 'sweetalert2';
import { todoService } from "../services/todoService";
import { useEffect } from "react";

const style = {
  py: 0,
  width: '100%',
  maxWidth: 360,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};


const ToDoListItem = () => {

  const [inputValue, setInputValue] = useState('')
  const [listItems, setListItems] = useState([]);

  // crear usuario, borrarlo y comprobar a nivel usuario si está creado el usuario

  const createUser = async () => {
    try {
      const user = "cesar_arnetta";
      await todoService.createUser(user)
    } catch (error) {

    }
  }
  const deleteUser = async () => {
    try {
      const user = "cesar_arnetta";
      await todoService.deleteUser(user);
      setListItems([]);
    } catch (error) {

    }
  }

  const checkUserCreated = async () => {
    try {
      const user = "cesar_arnetta";
      const checkUser = await todoService.getUser(user);
      if (checkUser && checkUser.name === user) {
        alert("The user Cesar Arnetta exist")
      } else {
        alert("The user Cesar Arnetta does not exist, please hit 'the create user button'")
      }
    } catch (error) {

    }
  }

  //traer tareas del usuario creado

  const getTaskIn = async () => {
    try {
      const bringTask = await todoService.getTask();
      const taskLabels = bringTask.map(task => ({
        label: task.label,
        id: task.id,
      }));
      setListItems(taskLabels);
    } catch (error) {

    }
  }

  useEffect(() => {
    getTaskIn()
  }, [])

  // crear tareas

  const getCreateTask = async () => {
    try {
      const newUser = {
        label: inputValue.trim(),
        is_done: "false",
      };
      const makeTasks = await todoService.createTask(newUser)
      setListItems(prevList => [...prevList, makeTasks]);
      setInputValue('');
    } catch (error) {

    }
  }

  // input controlado

  const changeInputValue = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      getCreateTask()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }


  // eliminar tarea individualmente

  const getDeleteTask = async (index) => {
    try {
      const taskToDelete = listItems[index];
      const taskId = taskToDelete.id;
      await todoService.deleteTask(taskId);
      const newList = listItems.filter((_, i) => i !== index);
      setListItems(newList);
    } catch (error) {

    }
  }

  const handleDelete = (index) => {
    Swal.fire({
      title: "Do you want to errase this task?",
      showDenyButton: true,
      confirmButtonText: "Accept",
      denyButtonText: `Cancel`
    }).then((result) => {
      if (result.isConfirmed) {
        getDeleteTask(index)

        // const newList = listItems.filter((_, i) => i !== index);
        // setListItems(newList);
      } else if (result.isDenied) {
        Swal.fire("You didn't delete any tasks", "", "info");
      }
    });
  };

  // https://sweetalert2.github.io/

  // eliminar tareas masivamente 

  const getDeleteAllTasks = async () => {
    try {
      for (let user of listItems) {
        const usersIDs = user.id;
        await todoService.deleteAllTasks(usersIDs);
      };

      setListItems([]);
    } catch (error) {

    }
  }

  return (
    <div className='container-fluid p-2'>
      <List sx={style} style={{ margin: "auto" }}>
        <div className="text-center p-2">
          <button className="btn btn-primary p-2 m-2" onClick={getDeleteAllTasks}>Errase all tasks</button>
          <button className="btn btn-primary p-2 m-2" onClick={createUser}>Create user</button>
          <button className="btn btn-primary p-2 m-2" onClick={deleteUser}>Delete user</button>
          <button className="btn btn-primary p-2 m-2" onClick={checkUserCreated}>Check user status</button>
        </div>
        <form onSubmit={handleSubmit}>
          <ListItem>
            <input placeholder={listItems.length === 0 ? "Add a task, we are empty" : "What needs to be done?"} type="text"
              value={inputValue}
              onChange={changeInputValue}
              onKeyDown={handleKeyDown}
              style={{ border: "none", outline: "none" }} />
          </ListItem>
          <Divider component="li" />
        </form>
        {listItems.map((task, index) => (
          <React.Fragment key={index}>
            <ListItem id={task.id}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => handleDelete(index)}>
              {task.label}
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}


export default ToDoListItem