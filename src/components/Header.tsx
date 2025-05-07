import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  DarkThemeToggle,
} from "flowbite-react";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { user } = useAuth();
  return (
    <Navbar
      rounded
      className="flex w-full flex-row items-center gap-4 bg-emerald-500 dark:bg-emerald-800"
    >
      <NavbarBrand href="https://github.com/AlexL69420/scrum" className="">
        <img
          src="https://i.pinimg.com/736x/8b/6b/98/8b6b987316a515a6c4d77684e32cccc7.jpg"
          className="mr-3 h-6 rounded-full object-cover sm:h-9"
          alt="logo"
        />
        <span className="self-center font-mono text-2xl font-semibold whitespace-nowrap text-emerald-200 hover:text-amber-100 dark:text-emerald-500">
          Alexander&Nikita
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <div className="flex w-3/4 items-center justify-around gap-2">
        <div className="flex flex-row flex-wrap gap-7 bg-gradient-to-r from-zinc-50 to-zinc-300 bg-clip-text font-mono text-xl font-semibold text-transparent">
          <Link to="/" className="hover:text-amber-100">
            Главная
          </Link>
          <Link to="/" className="hover:text-amber-100">
            Мои проекты
          </Link>
          <Link to="/" className="hover:text-amber-100">
            Профиль
          </Link>

          <div>
            {!user ? (
              <Link to="/auth" className="hover:text-amber-100">
                Авторизация
              </Link>
            ) : (
              <Link to="/profile">
                <h1 className="hover:text-amber-100">{user.username}</h1>
              </Link>
            )}
          </div>
        </div>
        <DarkThemeToggle className="flex size-12 items-center justify-around rounded-full border-2 border-white text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-amber-100 dark:border-slate-200 dark:text-slate-200 dark:hover:bg-emerald-700" />
      </div>
    </Navbar>
  );
}
