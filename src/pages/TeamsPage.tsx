import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams } from "react-router";

export function TeamsPage() {
  const teams = [
    { name: "Фронтенд", members: ["Иван Иванов", "Петр Петров"] },
    { name: "Бэкенд", members: ["Сидор Сидоров"] },
  ];
  const { id } = useParams();

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        <Sidebar />
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-6 flex w-full items-center justify-between">
              <h1 className="text-3xl font-bold">Команды проекта</h1>
              <button className="rounded bg-emerald-600 px-4 py-2 text-white">
                Создать команду
              </button>
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              {teams.map((team, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-700"
                >
                  <div className="mb-4 flex justify-between">
                    <h2 className="text-xl font-semibold">{team.name}</h2>
                    <button className="text-sm text-red-600 dark:text-red-400">
                      Удалить
                    </button>
                  </div>

                  <div className="space-y-2">
                    {team.members.map((member, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-gray-600"
                      >
                        <span>{member}</span>
                        <button className="text-sm text-red-600 dark:text-red-400">
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>

                  <button className="mt-3 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600">
                    + Добавить участника
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
