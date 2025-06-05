import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import api from "../utils/jwthandle";

type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  idSprint: number;
  status: TaskStatus;
  detail: string;
  teamDTO?: {
    id: number;
    name: string;
    idTask: number;
    hiredEmployeeDTOList: {
      idTeam: number;
      id: number;
      nameUser: string;
      nameEmployee: string;
      idRole: number;
    }[];
  };
}

interface ProjectUser {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  granted: "SUPER_USER" | "SUB_SUPER_USER" | "USER";
}

interface RoleResponse {
  user: User;
  granted: "SUPER_USER" | "SUB_SUPER_USER" | "USER";
}

export function TasksPage() {
  const { id, sprintid } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<
    "SUPER_USER" | "SUB_SUPER_USER" | "USER" | null
  >(null);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<ProjectUser[]>(
    [],
  );

  const [newTask, setNewTask] = useState({
    detail: "",
    teamName: "",
  });

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !sprintid) return;

        // Получаем роль пользователя
        const roleResponse = await api.get<RoleResponse>(
          `/user/get_role/${id}`,
        );
        setUserRole(roleResponse.data.granted);

        // Загружаем задачи в зависимости от роли
        if (roleResponse.data.granted === "USER") {
          const response = await api.get<Task[]>(
            `/task_board/${id}/get_task_command`,
          );
          setTasks(response.data);
        } else {
          // Загружаем участников проекта и их роли
          const projectRoleResponse = await api.get<ProjectUser[]>(
            `/project/${id}/get_user_role`,
          );
          setProjectUsers(projectRoleResponse.data);

          const response = await api.get<Task[]>(
            `/task_board/${id}/get_task_sprint?id_sprint=${sprintid}`,
          );
          setTasks(response.data);
        }
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, sprintid]);

  // Создание новой задачи
  const createTask = async () => {
    if (userRole === "USER") return;

    try {
      console.log(selectedTeamMembers);

      const taskData = {
        idSprint: Number(sprintid),
        status: "TO_DO" as TaskStatus,
        detail: newTask.detail,
        teamDTO: {
          name: newTask.teamName,
          hiredEmployeeDTOList: selectedTeamMembers.map((user) => ({
            //idTeam: 0,
            //id: user.user.id,
            nameUser: user.user.name,
            nameEmployee: user.user.name,
            idRole: user.id,
          })),
        },
      };

      await api.post(
        `/task_board/${id}/create?id_sprint=${sprintid}`,
        taskData,
      );

      // Обновляем список задач
      const response = await api.get<Task[]>(
        `/task_board/${id}/get_task_sprint?id_sprint=${sprintid}`,
      );
      setTasks(response.data);

      // Сбрасываем форму
      setNewTaskDialogOpen(false);
      setNewTask({ detail: "", teamName: "" });
      setSelectedTeamMembers([]);
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
      setError("Не удалось создать задачу");
    }
  };

  // Добавление/удаление участника команды
  const toggleTeamMember = (user: ProjectUser) => {
    setSelectedTeamMembers((prev) =>
      prev.some((m) => m.id === user.id)
        ? prev.filter((m) => m.id !== user.id)
        : [...prev, user],
    );
  };

  // Изменение статуса задачи (только для не-USER)
  const changeStatus = async (taskId: number, newStatus: TaskStatus) => {
    if (userRole === "USER") return;

    try {
      await api.put(`/task_board/${id}/update_status`, {
        id: taskId,
        status: newStatus,
      });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
    } catch (err) {
      console.error("Ошибка при изменении статуса:", err);
      setError("Не удалось изменить статус задачи");
    }
  };

  // Удаление задачи (только для не-USER)
  const deleteTask = async (taskId: number) => {
    if (userRole === "USER") return;

    if (!window.confirm("Вы уверены, что хотите удалить эту задачу?")) return;

    try {
      await api.delete(`/task_board/${id}/delete?id=${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
      setError("Не удалось удалить задачу");
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TO_DO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "DONE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case "TO_DO":
        return "К выполнению";
      case "IN_PROGRESS":
        return "В процессе";
      case "DONE":
        return "Завершена";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-br from-slate-100 to-slate-300 text-black dark:from-slate-700 dark:to-slate-900 dark:text-white">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="text-xl">Загрузка задач...</div>
        </div>
        <MyFooter />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-br from-slate-100 to-slate-300 text-black dark:from-slate-700 dark:to-slate-900 dark:text-white">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="rounded-xl bg-red-100 p-4 text-red-700 dark:bg-red-900/80 dark:text-red-100">
            {error}
          </div>
        </div>
        <MyFooter />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-br from-slate-100 to-slate-300 text-black dark:from-slate-700 dark:to-slate-900 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        {id !== undefined ? <Sidebar id={id} /> : null}
        <div className="flex w-2/3 justify-center">
          <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
            {/* Кнопка "Вернуться" */}
            {userRole !== "USER" && (
              <button
                onClick={() => navigate(-1)}
                className="group mb-6 flex items-center text-gray-600 hover:cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
                Вернуться к спринтам
              </button>
            )}

            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Доска задач</h1>
              {userRole !== "USER" && (
                <button
                  onClick={() => setNewTaskDialogOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-emerald-700"
                >
                  <FaPlus /> Новая задача
                </button>
              )}
            </div>

            {/* Список задач */}
            <div className="flex flex-wrap gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="w-full max-w-md rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700/90"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-xl font-semibold">Задача #{task.id}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {getStatusText(task.status)}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {task.detail}
                  </p>

                  {task.teamDTO && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Команда: {task.teamDTO.name}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Участников: {task.teamDTO.hiredEmployeeDTOList.length}
                      </span>
                    </div>
                  )}

                  {userRole !== "USER" && (
                    <div className="flex justify-end gap-2">
                      {task.status !== "TO_DO" && (
                        <button
                          onClick={() => changeStatus(task.id, "TO_DO")}
                          className="rounded-lg bg-gray-200 p-2 text-gray-700 transition hover:cursor-pointer hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                          title="Вернуть в 'К выполнению'"
                        >
                          <FaArrowLeft />
                        </button>
                      )}

                      {task.status !== "DONE" && (
                        <button
                          onClick={() =>
                            changeStatus(
                              task.id,
                              task.status === "TO_DO" ? "IN_PROGRESS" : "DONE",
                            )
                          }
                          className="rounded-lg bg-gray-200 p-2 text-gray-700 transition hover:cursor-pointer hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                          title={
                            task.status === "IN_PROGRESS"
                              ? "Завершить задачу"
                              : "Начать выполнение"
                          }
                        >
                          {task.status === "IN_PROGRESS" ? (
                            <FaCheck />
                          ) : (
                            <FaArrowRight />
                          )}
                        </button>
                      )}

                      <button
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:cursor-pointer hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                        title="Редактировать"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:cursor-pointer hover:bg-red-200 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
                        title="Удалить"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MyFooter />

      {/* Диалог добавления новой задачи (только для не-USER) */}
      {userRole !== "USER" && newTaskDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Новая задача</h2>
              <button
                title="button1"
                onClick={() => {
                  setNewTaskDialogOpen(false);
                  setSelectedTeamMembers([]);
                }}
                className="text-gray-500 hover:cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Описание задачи
                </label>
                <textarea
                  placeholder="Опишите задачу..."
                  value={newTask.detail}
                  onChange={(e) =>
                    setNewTask({ ...newTask, detail: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-emerald-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Название команды
                </label>
                <input
                  type="text"
                  placeholder="Введите название команды"
                  value={newTask.teamName}
                  onChange={(e) =>
                    setNewTask({ ...newTask, teamName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Участники команды
                </label>
                <div className="rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700">
                  {selectedTeamMembers.length > 0 ? (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {selectedTeamMembers.map((user) => (
                        <span
                          key={user.id}
                          className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        >
                          {user.user.name}
                          <button
                            title="button"
                            type="button"
                            onClick={() => toggleTeamMember(user)}
                            className="text-emerald-600 hover:cursor-pointer hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-100"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                      Выберите участников команды
                    </p>
                  )}

                  <div className="max-h-40 overflow-y-auto">
                    {projectUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => toggleTeamMember(user)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${selectedTeamMembers.some((m) => m.id === user.id) ? "bg-emerald-50 dark:bg-emerald-900/30" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                      >
                        <div>
                          <p className="font-medium">{user.user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.user.email} • {user.granted}
                          </p>
                        </div>
                        {selectedTeamMembers.some((m) => m.id === user.id) ? (
                          <FaCheck className="text-emerald-500" />
                        ) : (
                          <div className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setNewTaskDialogOpen(false);
                  setSelectedTeamMembers([]);
                }}
                className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Отмена
              </button>
              <button
                onClick={createTask}
                disabled={
                  !newTask.detail ||
                  !newTask.teamName ||
                  selectedTeamMembers.length === 0
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:cursor-pointer hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Создать задачу
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
