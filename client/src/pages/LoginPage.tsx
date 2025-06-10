import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LOCAL_API_URL } from "../utils/environment";
import { FiX, FiLogIn, FiUserPlus } from "react-icons/fi";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!username.trim() || !password.trim()) {
        setError("Пожалуйста, заполните все поля");
        return;
      }

      const response: AxiosResponse = await axios.post(
        `${LOCAL_API_URL}/auth/authenticate`,
        {
          login: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        const token = response.headers["authorization"];
        if (!token) throw new Error("Токен не найден");

        localStorage.setItem("jwtToken", token);
        navigate("/");
      } else {
        throw new Error(`Неожиданный статус ответа: ${response.status}`);
      }
    } catch (err) {
      handleAuthError(err as AxiosError | Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Некорректные данные");
            break;
          case 401:
            setError("Неверный логин или пароль");
            break;
          case 403:
            setError("Доступ запрещен");
            break;
          case 404:
            setError("Сервер авторизации недоступен");
            break;
          case 500:
            setError("Ошибка сервера. Попробуйте позже");
            break;
          default:
            setError(`Ошибка сервера (${error.response.status})`);
        }
      } else if (error.request) {
        setError("Сервер не отвечает. Проверьте подключение");
      } else {
        setError("Ошибка при отправке запроса");
      }
    } else {
      setError(error.message || "Произошла неизвестная ошибка");
    }
    console.error("Ошибка входа:", error);
  };

  const ErrorDisplay = () => (
    <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900/50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Ошибка входа
        </h3>
        <div
          onClick={() => setError("")}
          className="text-red-800 hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
        >
          <FiX className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
    </div>
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-800">
        <div className="w-full max-w-md">
          <ErrorDisplay />
          <button
            onClick={() => setError("")}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus:ring-emerald-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-800">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Вход в аккаунт
          </h1>
          <Link
            to="/"
            className="rounded-full p-2 text-gray-500 hover:cursor-pointer hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
            aria-label="Закрыть"
          >
            <FiX className="h-5 w-5" />
          </Link>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                placeholder="Введите имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus:ring-emerald-600"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <FiLogIn className="mr-2" />
                Войти
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-600 hover:cursor-pointer hover:underline dark:text-emerald-400"
          >
            <FiUserPlus className="mr-1 inline" />
            Зарегистрируйтесь
          </Link>
        </div>
      </div>
    </main>
  );
}
