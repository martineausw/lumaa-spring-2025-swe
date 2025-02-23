import React from "react";

export default function RegisterForm({ setRegister, createUser }) {
  function getInput(e) {
    e.preventDefault();
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    createUser(username!.value, password!.value);
  }

  return (
    <>
      <h3>Register</h3>
      <form onSubmit={getInput}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="User Name"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="password"
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input id="confirm-password" type="password" placeholder="password" />
        <input type="submit" value="Submit" />
      </form>
      <label>
        Already have an account?
        <button onClick={() => setRegister(false)}>Login Here</button>
      </label>
    </>
  );
}
