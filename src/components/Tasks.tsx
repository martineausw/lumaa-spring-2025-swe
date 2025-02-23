import React from "react";
import Task from "./Task";

export default function Tasks({ tasks, handleChange, handleDelete }) {
  return (
    <>
      {tasks.map((task) => (
        <Task
          {...task}
          handleChange={handleChange}
          handleDelete={handleDelete}
          key={task.id}
        />
      ))}
    </>
  );
}
