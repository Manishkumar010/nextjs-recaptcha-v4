"use client";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!window.grecaptcha || !window.grecaptcha.execute) {
      setMsg("reCAPTCHA not ready. Try again...");
      return;
    }

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "register" }
      );

      const res = await axios.post("/api/register", { ...form, token });
      setMsg(res.data.message);
    } catch (err) {
      console.log(err);
      setMsg("Error submitting form");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <p>{msg}</p>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button>Register</button>
      </form>
    </div>
  );
}
