import { MyFooter } from "../components/Footer";
import { Header } from "../components/Header";
import { useParams } from "react-router";
import { Sidebar } from "../components/Sidebar";

export default function ProjectPage() {
  const { id } = useParams();
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6 dark:text-white">
        <Sidebar />
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            {/* Заголовок и основная информация */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
                <span className="rounded px-2 py-1">Имя проекта</span>
              </h1>

              <div className="mb-4 flex items-center text-gray-600 dark:text-gray-300">
                <span className="font-medium">Создатель:</span>
                <span className="ml-2 rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">
                  Имя создателя
                </span>
              </div>

              <p className="rounded-lg border border-gray-200 p-4 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                К проекту имеют доступ только приглашённые пользователи. Для
                того, чтобы пригласить пользователя, Выберите его роль и нажмите
                "сгенерировать ссылку". После этого скопируйте ссылку и оправьте
                её пользователюю При переходе пользователя по ссылке он будет
                добавлен в ваш проект с соответствующей ролью.
              </p>
            </div>

            {/* Генерация ссылки */}
            <div className="w-2/3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-700">
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                Доступ к проекту
              </h2>

              <div className="mb-4">
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                  Сгенерировать ссылку для доступа
                </button>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Выберите роль для предоставления доступа:
                </label>
                <select
                  title="dd"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500"
                >
                  <option>SCRUM-мастер</option>
                  <option>Разработчик</option>
                </select>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ссылка для доступа:
                </p>
                <div className="mt-2 rounded-lg border border-gray-300 bg-gray-100 p-3 font-mono text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                  https://example.com/project/123?token=abcde
                </div>
                <button className="mt-2 text-sm text-emerald-600 hover:cursor-pointer hover:underline dark:text-emerald-400">
                  Скопировать ссылку
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
