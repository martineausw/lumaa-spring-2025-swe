import React from "react";

export default function Task({
  id,
  title,
  description,
  isComplete,
  handleUpdate,
  handleDelete,
}) {
  return (
    <li id={id}>
      <h4>{title}</h4>
      <p>{description}</p>
      <label>
        <input type="checkbox" checked={isComplete} onChange={handleUpdate} />
      </label>
      <button onClick={handleDelete}>Remove</button>
    </li>
  );
}
