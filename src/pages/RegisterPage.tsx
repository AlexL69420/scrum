import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LOCAL_API_URL } from "../environment";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "flowbite-react";

export default function RegisterForm() {
  // Состояние для обработки ошибок
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayedName, setDisplayedName] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${LOCAL_API_URL}/auth/sign`,
        {
          username,
          password,
          displayedName,
        },
        { withCredentials: true },
      );

      console.log("Успешный вход:", response.data);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Обработка ошибок, возвращаемых сервером
        if (err.response) {
          const errorMessage =
            err.response.data.error || "Ошибка при создании пользователя";
          setError(errorMessage);
        } else if (err.request) {
          setError("Ошибка сети. Проверьте подключение к интернету.");
        } else {
          setError("Произошла ошибка при отправке запроса.");
        }
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

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
        <h1 className="mb-6 text-center text-2xl font-bold">
          Регистрация аккаунта
        </h1>

        {error && <p className="mb-4 text-xl text-red-500">{error}</p>}
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="text"
            placeholder="Отображаемое имя"
            value={displayedName}
            onChange={(e) => setDisplayedName(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-600"
          />

          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full max-w-lg rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-600"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-lg rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-600"
          />

          <button
            type="submit"
            className="w-full max-w-lg rounded-lg bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600 dark:bg-sky-900 dark:text-slate-200 dark:hover:bg-blue-800"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </main>
  );
}
