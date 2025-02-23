import "./App.css";
import React, { useEffect, useState } from "react";
import RegisterForm from "./components/RegisterForm";

import {
  getToken,
  deleteAccessToken,
  setAccessToken,
  setRefreshToken,
} from "./jwtStorage.tsx";

import LoginForm from "./components/LoginForm.tsx";
import Tasks from "./components/Tasks.tsx";

function App() {
  const [userId, setUserId] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [register, setRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [response, setResponse] = useState(200);

  useEffect(() => {
    if (response >= 400) setAuthorized(false);
  }, [response]);

  useEffect(() => {
    if (!authorized) deleteAccessToken();
  }, [authorized]);

  function createTask(title, description) {
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, userId }),
    }).then((res) => {
      setResponse(res.status);
    });
  }

  function createUser(username, password) {
    fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      setResponse(res.status);

      const remote = await res.json();

      setAccessToken(remote.accessToken);
      setRefreshToken(remote.refreshToken);
    });
  }

  function authorize(username, password) {
    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      setResponse(res.status);

      const remote = await res.json();

      if (remote.accessToken) {
        setAccessToken(remote.accessToken);
      }
      setAuthorized(true);
    });
  }

  function readTasks() {
    fetch("http://localhost:3000/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then(async (res) => {
      setResponse(res.status);
      const remoteTasks = await res.json();
      setTasks(() => {
        return remoteTasks.map((task) => {
          return {
            id: task.id,
            title: task.title,
            description: task.description,
            isComplete: task.isComplete,
          };
        });
      });
    });
  }

  function updateTask(id, args) {
    fetch(`http://localhost:3000/tasks?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...args }),
    }).then(async (res) => {
      setResponse(res.status);
      const remote = await res.json();
      setTasks(() => {
        return tasks.map((task) => {
          if (id === task) {
            return {
              title: remote.title,
              description: remote.description,
              isComplete: remote.isComplete,
            };
          }
          return task;
        });
      });
    });
  }

  function deleteTask(id: string) {
    fetch(`http://localhost:3000/tasks?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then(async (res) => {
      setResponse(res.status);
      setTasks(() => {
        return tasks.filter((task) => id !== task.id);
      });
    });
  }

  return (
    <>
      {authorized ? (
        <Tasks
          tasks={tasks}
          handleChange={updateTask}
          handleDelete={deleteTask}
        />
      ) : register ? (
        <RegisterForm setRegister={setRegister} createUser={createUser} />
      ) : (
        <LoginForm setRegister={setRegister} authorize={authorize} />
      )}
    </>
  );
}

export default App;
