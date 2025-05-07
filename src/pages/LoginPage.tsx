import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LOCAL_API_URL } from "../environment";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "flowbite-react";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${LOCAL_API_URL}/auth/authenticate`,
        {
          username,
          password,
        },
        { withCredentials: true },
      );
      console.log("Успешный вход:", response.data);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      setError(`error: ${err}`);
    }
  };

  // Отображение ошибки
  if (error) {
    return (
      <div className="min-h-screen px-2 py-3 text-black dark:bg-slate-700 dark:text-white">
        {error}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-slate-500">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-slate-700 dark:text-slate-200">
        <div className="flex w-full justify-end">
          <Link to="/">
            <Button
              color="light"
              className="flex size-10 items-center justify-center rounded-full border-2 border-black bg-white text-black hover:bg-slate-300 disabled:pointer-events-none dark:border-white dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              X
            </Button>
          </Link>
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold">Вход в аккаунт</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-sky-900 dark:text-slate-200 dark:hover:bg-blue-800"
          >
            Войти
          </button>
        </form>
        <div className="flex flex-row items-center gap-2 p-2">
          <h1>Нет аккаунта?</h1>
          <Link to="/register" className="font-bold hover:underline">
            зарегистрируйтесь
          </Link>
        </div>
      </div>
    </main>
  );
}
