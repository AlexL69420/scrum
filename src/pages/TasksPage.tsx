import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams } from "react-router";
import { useState } from "react";

// Иконки можно использовать из react-icons (https://react-icons.github.io/react-icons)
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
//import { MdIncompleteCircle } from "react-icons/md";

type TaskStatus = "To Do" | "In Progress" | "Done";
type TaskDifficulty = "Easy" | "Medium" | "Hard";

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  team: string;
  status: TaskStatus;
  deadline: Date;
}

export function TasksPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Реализовать авторизацию",
      description: "Добавить форму входа и регистрации с валидацией",
      difficulty: "Medium",
      team: "Фронтенд",
      status: "To Do",
      deadline: new Date("2025-12-15"),
    },
    {
      id: "2",
      title: "Оптимизировать запросы к API",
      description: "Уменьшить количество запросов с помощью кэширования",
      difficulty: "Hard",
      team: "Бекенд",
      status: "In Progress",
      deadline: new Date("2025-12-20"),
    },
    {
      id: "3",
      title: "Добавить мобильную адаптацию",
      description: "Адаптировать главную страницу для мобильных устройств",
      difficulty: "Easy",
      team: "Фронтенд",
      status: "Done",
      deadline: new Date("2025-12-10"),
    },
    {
      id: "4",
      title: "Настроить CI/CD",
      description: "Развернуть пайплайн для автоматического деплоя",
      difficulty: "Hard",
      team: "Бекенд",
      status: "To Do",
      deadline: new Date("2025-12-30"),
    },
  ]);

  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

  const changeStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty: TaskDifficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-br from-slate-100 to-slate-300 text-black dark:from-slate-700 dark:to-slate-900 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        <Sidebar />
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Доска задач</h1>
              <button
                onClick={() => setNewTaskDialogOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
              >
                <FaPlus /> Новая задача
              </button>
            </div>

            {/* Список задач */}
            <div className="flex flex-wrap gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="w-full max-w-md rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700/90"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                        task.status,
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {task.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(
                        task.difficulty,
                      )}`}
                    >
                      {task.difficulty}
                    </span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {task.team}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                      {task.deadline.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    {/* Кнопка перемещения статуса назад */}
                    {task.status !== "To Do" && (
                      <button
                        onClick={() =>
                          changeStatus(
                            task.id,
                            task.status === "In Progress"
                              ? "To Do"
                              : "In Progress",
                          )
                        }
                        className="rounded-lg bg-gray-200 p-2 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        title="Move back"
                      >
                        <FaArrowLeft />
                      </button>
                    )}

                    {/* Кнопка перемещения статуса вперед */}
                    {task.status !== "Done" && (
                      <button
                        onClick={() =>
                          changeStatus(
                            task.id,
                            task.status === "To Do" ? "In Progress" : "Done",
                          )
                        }
                        className="rounded-lg bg-gray-200 p-2 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        title={
                          task.status === "In Progress"
                            ? "Mark as done"
                            : "Move to progress"
                        }
                      >
                        {task.status === "In Progress" ? (
                          <FaCheck />
                        ) : (
                          <FaArrowRight />
                        )}
                      </button>
                    )}

                    {/* Кнопка редактирования */}
                    <button
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    {/* Кнопка удаления */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MyFooter />

      {/* Диалог добавления новой задачи (заглушка) */}
      {newTaskDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold">Новая задача</h2>
            <div className="mb-4 grid gap-4">
              <input
                type="text"
                placeholder="Название задачи"
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
              <textarea
                placeholder="Описание"
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
              <select
                title="s"
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <select
                title="ss"
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option>Фронтенд</option>
                <option>Бекенд</option>
              </select>
              <input
                title="i"
                type="date"
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewTaskDialogOpen(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Отмена
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700">
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
