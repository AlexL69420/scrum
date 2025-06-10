import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Проверяем наличие класса 'dark' на корневом html-элементе
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // Проверить сразу при загрузке
    checkDarkMode();

    // Наблюдать за изменениями (на случай, если тема изменится после загрузки)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main
      className={`flex min-h-screen items-center justify-center ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <div
        className={`flex w-full max-w-md flex-col items-center gap-6 rounded-xl border p-8 shadow-lg ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <FiAlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-xl font-medium">Страница не найдена</p>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Похоже, такой страницы не существует или она была перемещена
            </p>
          </div>
        </div>

        <Link
          to="/"
          className={`w-full rounded-lg px-6 py-3 text-center font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
            isDark
              ? "bg-emerald-700 hover:bg-emerald-600 focus:ring-emerald-600 focus:ring-offset-gray-800"
              : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 focus:ring-offset-white"
          }`}
        >
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
