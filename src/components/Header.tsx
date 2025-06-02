import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  DarkThemeToggle,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/jwthandle";
import { isAuthenticated } from "../utils/auth";

interface UserData {
  username: string;
}

export function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated()) {
        try {
          const response = await api.get<UserData>("/auth/user");
          setUser(response.data);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <Navbar
      rounded
      className="flex w-full flex-row items-center justify-between border-b border-gray-200 bg-white px-8 dark:bg-gray-800"
    >
      <NavbarBrand href="https://github.com/AlexL69420/scrum" className="">
        <img
          src="https://i.pinimg.com/736x/8b/6b/98/8b6b987316a515a6c4d77684e32cccc7.jpg"
          className="mr-3 h-6 rounded-full object-cover sm:h-9"
          alt="logo"
        />
        <span className="self-center font-mono text-2xl font-semibold whitespace-nowrap text-emerald-500 hover:text-amber-200 dark:text-emerald-500">
          Alexander&Nikita
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text font-mono text-xl font-semibold text-transparent">
          {loading ? (
            <div className="h-6 w-24 animate-pulse rounded bg-gray-300"></div>
          ) : !user ? (
            <Link to="/auth" className="hover:text-amber-200">
              Авторизация
            </Link>
          ) : (
            <Link to="/profile">
              <h1 className="hover:text-amber-100">{user.username}</h1>
            </Link>
          )}
        </div>

        <DarkThemeToggle className="flex size-12 items-center justify-around rounded-full border-2 border-slate-700 text-slate-800 hover:cursor-pointer hover:bg-slate-50 hover:text-amber-200 dark:border-slate-200 dark:text-slate-200 dark:hover:bg-slate-700" />
      </div>
    </Navbar>
  );
}
