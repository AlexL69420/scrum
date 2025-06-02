import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams } from "react-router";

export function MembersPage() {
  const members = [
    { name: "Иван Иванов", role: "Создатель" },
    { name: "Петр Петров", role: "Scrum Master" },
    { name: "Сидор Сидоров", role: "Разработчик" },
  ];
  const { id } = useParams();

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        <Sidebar />
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            <h1 className="mb-6 text-3xl font-bold">Участники проекта</h1>

            <div className="w-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-700">
              <div className="mb-4 flex justify-between">
                <h2 className="text-xl font-semibold">Список участников</h2>
                <button className="rounded bg-emerald-600 px-4 py-2 text-white">
                  Пригласить
                </button>
              </div>

              <div className="space-y-3">
                {members.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-gray-200 p-3 dark:border-gray-600"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    {member.role !== "Создатель" && (
                      <button className="rounded bg-red-100 px-3 py-1 text-sm text-red-600 dark:bg-red-900 dark:text-red-200">
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
