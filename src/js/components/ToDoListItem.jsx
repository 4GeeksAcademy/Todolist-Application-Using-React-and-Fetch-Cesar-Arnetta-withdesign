// Your app needs to look like this.
// The tasks are added when the user presses enter on the keyboard, or you can have your own button.
// The delete icon shows only when the task is hovered.
// The user can add as many tasks as they want.
// When there are no tasks the list should say "No tasks, add a task"
// There is no way to update a task, the user will have to delete and create again.

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

  const getUserIn = async () => {
    try {
      const bringUsers = await todoService.getUsers();
      const taskLabels = bringUsers.map(task => ({
        label: task.label,
        id: task.id,
      }));
      console.log(taskLabels);
      setListItems(taskLabels);
    } catch (error) {

    }
  }

  useEffect(() => {
    getUserIn()
  }, [])

  const getCreateUser = async () => {
    try {
      const newUser = {
        label: inputValue.trim(),
        is_done: "false",
      };

      const makeUsers = await todoService.createUser(newUser)
      console.log(createdTask);

      setListItems(prevList => [...prevList, makeUsers]);
      setInputValue('');
    } catch (error) {

    }
  }

  // const getDeleteUser = async (index) => {
  //   try {
  //     const userDeleted = listItems[index];
  //     const userName = userDeleted.name;
  //     await todoService.deleteUser(userName);
  //     const newList = listItems.filter((_, i) => i !== index);
  //     setListItems(newList);
  //   } catch (error) {

  //   }
  // }


  const getDeleteUser = async (index) => {
    try {
      const taskToDelete = listItems[index];
      const taskId = taskToDelete.id;
      console.log(taskId)
      await todoService.deleteUser(taskId);
      const newList = listItems.filter((_, i) => i !== index);
      setListItems(newList);
    } catch (error) {

    }
  }


  const getDeleteAllUsers = async () => {
    try {
      for (let user of listItems) {
        const usersIDs = user.id;
        await todoService.deleteAllUsers(usersIDs)
      };

      // setListItems([]);
    } catch (error) {

    }
  }

  const changeInputValue = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      getCreateUser()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleDelete = (index) => {
    Swal.fire({
      title: "Do you want to errase this task?",
      showDenyButton: true,
      confirmButtonText: "Accept",
      denyButtonText: `Cancel`
    }).then((result) => {
      if (result.isConfirmed) {
        getDeleteUser(index)

        // const newList = listItems.filter((_, i) => i !== index);
        // setListItems(newList);
      } else if (result.isDenied) {
        Swal.fire("You didn't delete any tasks", "", "info");
      }
    });
  };

  // https://sweetalert2.github.io/


  return (
    <div className='container-fluid p-2'>
      <List sx={style} style={{ margin: "auto" }}>
        <button onClick={getDeleteAllUsers}>Borrar todo</button>
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