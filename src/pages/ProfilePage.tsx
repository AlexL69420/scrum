import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyFooter } from "../components/Footer";
import { Button } from "flowbite-react";
import api from "../utils/jwthandle";
import { isAuthenticated } from "../utils/auth";

interface UserData {
  id: number;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (isAuthenticated()) {
      try {
        const response = await api.get<UserData>("/user/get");
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
    setLoading(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Заглушка - просто показываем сообщение
    setSuccess("Функция изменения пароля временно недоступна");
    setOldPassword("");
    setNewPassword("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center bg-emerald-50 dark:bg-slate-800">
        <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center p-4">
          <div className="text-xl font-medium text-emerald-600 dark:text-emerald-400">
            Загрузка данных...
          </div>
        </div>
        <MyFooter />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-emerald-50 dark:bg-slate-800">
      <div className="flex w-full max-w-4xl flex-1 flex-col items-center p-4">
        <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-700/90 dark:text-white">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <Link to="/">
              <Button
                color="light"
                className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm hover:cursor-pointer hover:bg-emerald-200 hover:text-red-500 dark:bg-slate-600 dark:text-emerald-300 dark:hover:bg-slate-500 dark:hover:text-red-400"
              >
                X
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-center dark:from-slate-700 dark:to-slate-800">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-4xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">
              Профиль пользователя
            </h1>
            <div className="mt-2 text-xl font-medium text-emerald-100 dark:text-slate-300">
              {user?.name || "Пользователь"}
            </div>
            <div className="mt-1 text-sm text-emerald-200 dark:text-slate-400">
              {user?.email}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Change Password Form */}
            <form
              onSubmit={handleChangePassword}
              className="mb-8 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800/80"
            >
              <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
                Изменение пароля
              </h2>

              {success && (
                <div className="mb-6 rounded-xl bg-emerald-100 p-4 text-emerald-800 shadow-sm dark:bg-emerald-900/50 dark:text-emerald-200">
                  {success}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Старый пароль
                  </label>
                  <input
                    id="oldPassword"
                    type="password"
                    placeholder="Введите старый пароль"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-emerald-600/50"
                    disabled
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Новый пароль
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Введите новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-emerald-600/50"
                    disabled
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition duration-200 hover:cursor-pointer hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:ring-slate-600"
                  disabled
                >
                  Изменить пароль
                </button>
              </div>
            </form>

            {/* Logout Button */}
            <div className="text-center">
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500/90 px-8 py-3 font-medium text-white transition duration-200 hover:cursor-pointer hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:bg-red-700/90 dark:hover:bg-red-600/90 dark:focus:ring-red-700"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
