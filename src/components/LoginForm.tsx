import React from "react";

export default function LoginForm({ setRegister, authorize }) {
  function handleSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    authorize(username!.value, password!.value);
  }

  return (
    <>
      <form onSubmit={() => handleSubmit(e)}>
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
        <input type="submit" value="Submit" />
      </form>
      <label>
        Need an account?
        <button onClick={() => setRegister(true)}>Register Here</button>
      </label>
    </>
  );
}
