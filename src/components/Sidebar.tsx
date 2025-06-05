import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/jwthandle";

interface User {
  id: number;
  name: string;
  email: string;
}

interface RoleResponse {
  user: User;
  granted: "SUPER_USER" | "SUB_SUPER_USER" | "USER";
}

type SidebarProps = {
  id: string;
};

export function Sidebar({ id }: SidebarProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<
    "SUPER_USER" | "SUB_SUPER_USER" | "USER" | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Загрузка роли пользователя
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Получаем роль пользователя
        const roleResponse = await api.get<RoleResponse>(
          `/user/get_role/${id}`,
        );
        setUserRole(roleResponse.data.granted);
      } catch (err) {
        console.error("Ошибка при загрузке роли пользователя:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [id]);

  const menuItems = [
    { name: "Главная", onClick: () => navigate(`/project/${id}`) },
    {
      name: "Доска заданий",
      onClick: () =>
        navigate(
          userRole === "USER"
            ? `/project/${id}/taskboard/0`
            : `/project/${id}/sprints`,
        ),
    },
    ...(userRole !== "USER"
      ? [
          {
            name: "Аналитика",
            onClick: () => navigate(`/project/${id}/analytics`),
          },
          {
            name: "Участники",
            onClick: () => navigate(`/project/${id}/members`),
          },
        ]
      : []),

    { name: "Команды", onClick: () => navigate(`/project/${id}/teams`) },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-6rem)]">
        <div className="flex min-w-64 flex-col border-r border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="animate-pulse space-y-4">
            <div className="h-8 rounded bg-gray-200 dark:bg-slate-700"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded bg-gray-200 dark:bg-slate-700"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)]">
      {!isCollapsed && (
        <aside className="flex min-w-64 flex-col border-r border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <header className="mb-4 flex w-full flex-col items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Меню проекта
            </h2>
          </header>

          <nav className="flex-1">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.onClick}
                    className="w-full rounded-lg px-3 py-2 text-left font-medium text-gray-700 transition-colors hover:cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-emerald-300"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => navigate("/")}
            className="mb-4 flex w-full items-center justify-center rounded-lg border-gray-200 bg-white p-3 shadow-sm hover:cursor-pointer dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-xl font-semibold text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300">
              Другие проекты
            </span>
          </button>
        </aside>
      )}

      <button
        onClick={toggleCollapse}
        className={`hover:bg-emergent-700 flex h-10 items-center justify-center self-center rounded-r-lg bg-emerald-600 px-1.5 transition-colors hover:cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:bg-slate-900 dark:hover:bg-slate-600 dark:focus:ring-slate-600 ${
          isCollapsed ? "ml-0" : "-ml-1"
        }`}
        aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
      >
        <span className="text-lg font-bold text-white">
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
