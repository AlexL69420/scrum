import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams } from "react-router";

export function AnalyticsPage() {
  const { id } = useParams();
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        <Sidebar />
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            <h1 className="mb-6 text-3xl font-bold">Аналитика проекта</h1>

            <div className="grid w-full grid-cols-2 gap-4">
              {/* Burn-down Chart */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-700">
                <h2 className="mb-2 text-xl font-semibold">Burn-down Chart</h2>
                <div className="h-64 bg-gray-100 dark:bg-gray-600">
                  {/* Здесь будет график */}
                  <p className="flex h-full items-center justify-center">
                    График загрузки
                  </p>
                </div>
              </div>

              {/* Velocity */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-700">
                <h2 className="mb-2 text-xl font-semibold">Скорость команд</h2>
                <div className="text-center text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  42
                </div>
                <p className="text-center">story points/спринт</p>
              </div>
            </div>

            <div className="mt-6 w-full rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-700">
              <h2 className="mb-4 text-xl font-semibold">
                Статистика по задачам
              </h2>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold">15</div>
                  <div>Всего задач</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8</div>
                  <div>В работе</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">7</div>
                  <div>Завершено</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
