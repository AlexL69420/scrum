import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LOCAL_API_URL } from "../utils/environment";
import { FiX, FiUser, FiLock, FiUserPlus, FiLogIn } from "react-icons/fi";

export default function RegisterForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayedName, setDisplayedName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Валидация полей
      if (!username.trim() || !password.trim() || !displayedName.trim()) {
        setError("Пожалуйста, заполните все поля");
        return;
      }

      const response = await axios.post(
        `${LOCAL_API_URL}/auth/sign`,
        {
          login: username,
          password: password,
          name: displayedName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Успешная регистрация:", response.data);
      navigate("/auth");
    } catch (err) {
      handleRegistrationError(err as AxiosError | Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationError = (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error || "Ошибка при регистрации";
        setError(errorMessage);
      } else if (error.request) {
        setError("Ошибка сети. Проверьте подключение к интернету.");
      } else {
        setError("Произошла ошибка при отправке запроса.");
      }
    } else {
      setError("Неизвестная ошибка");
    }
    console.error("Ошибка регистрации:", error);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-800">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            <FiUserPlus className="mr-2 inline" />
            Регистрация
          </h1>
          <Link
            to="/"
            className="rounded-full p-2 text-gray-500 hover:cursor-pointer hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
            aria-label="Закрыть"
          >
            <FiX className="h-5 w-5" />
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 dark:bg-red-900/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Ошибка
              </h3>
              <div
                onClick={() => setError(null)}
                className="text-red-800 hover:cursor-pointer hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
              >
                <FiX className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Отображаемое имя
              </label>
              <div className="relative">
                <FiUser className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="displayName"
                  type="text"
                  placeholder="Ваше имя"
                  value={displayedName}
                  onChange={(e) => setDisplayedName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Имя пользователя
              </label>
              <div className="relative">
                <FiUser className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Придумайте логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Пароль
              </label>
              <div className="relative">
                <FiLock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="Придумайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                  disabled={isLoading}
                />
              </div>
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
                <FiUserPlus className="mr-2" />
                Зарегистрироваться
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Уже есть аккаунт?{" "}
          <Link
            to="/auth"
            className="font-medium text-emerald-600 hover:cursor-pointer hover:underline dark:text-emerald-400"
          >
            <FiLogIn className="mr-1 inline" />
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
}
