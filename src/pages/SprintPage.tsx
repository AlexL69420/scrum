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
} from "react-icons/fa";
import api from "../utils/jwthandle";

type SprintStatus = "TO_DO" | "IN_PROGRESS" | "DONE";

interface Sprint {
  id: number;
  daysInterval: number;
  idProject: number;
  timeExpired: string;
  idMeta: number;
  status: SprintStatus;
  priority: number;
  purpose: string;
}

interface UserRoleResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  granted: "SUPER_USER" | "SUB_SUPER_USER" | "USER";
}

export function SprintsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<
    "SUPER_USER" | "SUB_SUPER_USER" | "USER" | null
  >(null);

  // Состояния для нового спринта
  const [newSprintDialogOpen, setNewSprintDialogOpen] = useState(false);
  const [newSprint, setNewSprint] = useState({
    daysInterval: 14,
    purpose: "",
    timeExpired: "",
    priority: 1,
  });

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        // Загружаем роль пользователя
        const roleResponse = await api.get<UserRoleResponse>(
          `/project/${id}/get_user_role`,
        );
        setUserRole(roleResponse.data.granted);

        // Загружаем спринты
        const sprintsResponse = await api.get<Sprint[]>(
          `/sprint_board/${id}/get_all`,
        );
        setSprints(sprintsResponse.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Изменение статуса спринта (только для не-USER)
  const changeStatus = async (sprintId: number, newStatus: SprintStatus) => {
    if (userRole === "USER") return;

    try {
      await api.put(`/sprint_board/${sprintId}/update_status`, {
        status: newStatus,
      });
      setSprints(
        sprints.map((sprint) =>
          sprint.id === sprintId ? { ...sprint, status: newStatus } : sprint,
        ),
      );
    } catch (err) {
      console.error("Ошибка при изменении статуса:", err);
      setError("Не удалось изменить статус спринта");
    }
  };

  // Удаление спринта (только для не-USER)
  const deleteSprint = async (sprintId: number) => {
    if (userRole === "USER") return;

    if (!window.confirm("Вы уверены, что хотите удалить этот спринт?")) return;

    try {
      await api.delete(`/sprint_board/${id}/delete?id=${sprintId}`);
      setSprints(sprints.filter((sprint) => sprint.id !== sprintId));
    } catch (err) {
      console.error("Ошибка при удалении спринта:", err);
      setError("Не удалось удалить спринт");
    }
  };

  // Создание нового спринта (только для не-USER)
  const createSprint = async () => {
    if (userRole === "USER") return;

    try {
      const sprintData = {
        ...newSprint,
        idProject: Number(id),
        status: "TO_DO" as SprintStatus,
        idMeta: 0,
      };

      await api.post(`/sprint_board/${id}/create`, sprintData);

      // Обновляем список спринтов
      const response = await api.get<Sprint[]>(`/sprint_board/${id}/get_all`);
      setSprints(response.data);

      setNewSprintDialogOpen(false);
      setNewSprint({
        daysInterval: 14,
        purpose: "",
        timeExpired: "",
        priority: 1,
      });
    } catch (err) {
      console.error("Ошибка при создании спринта:", err);
      setError("Не удалось создать спринт");
    }
  };

  const getStatusColor = (status: SprintStatus) => {
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-br from-slate-100 to-slate-300 text-black dark:from-slate-700 dark:to-slate-900 dark:text-white">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="text-xl">Загрузка спринтов...</div>
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
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Спринты</h1>
              {userRole !== "USER" && (
                <button
                  onClick={() => setNewSprintDialogOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-emerald-700"
                >
                  <FaPlus /> Новый спринт
                </button>
              )}
            </div>

            {/* Список спринтов */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sprints.map((sprint) => (
                <div
                  key={sprint.id}
                  onClick={() =>
                    navigate(`/project/${id}/taskboard/${sprint.id}`)
                  }
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700/90"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-xl font-semibold">
                      Спринт #{sprint.id}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(sprint.status)}`}
                    >
                      {sprint.status === "TO_DO"
                        ? "К выполнению"
                        : sprint.status === "IN_PROGRESS"
                          ? "В процессе"
                          : "Завершен"}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {sprint.purpose}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {sprint.daysInterval} дней
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                      До {formatDate(sprint.timeExpired)}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Приоритет: {sprint.priority}
                    </span>
                  </div>

                  {userRole !== "USER" && (
                    <div className="flex justify-end gap-2">
                      {sprint.status !== "TO_DO" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(
                              sprint.id,
                              sprint.status === "IN_PROGRESS"
                                ? "TO_DO"
                                : "IN_PROGRESS",
                            );
                          }}
                          className="rounded-lg bg-gray-200 p-2 text-gray-700 transition hover:cursor-pointer hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                          title="Move back"
                        >
                          <FaArrowLeft />
                        </button>
                      )}

                      {sprint.status !== "DONE" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(
                              sprint.id,
                              sprint.status === "TO_DO"
                                ? "IN_PROGRESS"
                                : "DONE",
                            );
                          }}
                          className="rounded-lg bg-gray-200 p-2 text-gray-700 transition hover:cursor-pointer hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                          title={
                            sprint.status === "IN_PROGRESS"
                              ? "Завершить спринт"
                              : "Начать спринт"
                          }
                        >
                          {sprint.status === "IN_PROGRESS" ? (
                            <FaCheck />
                          ) : (
                            <FaArrowRight />
                          )}
                        </button>
                      )}

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:cursor-pointer hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSprint(sprint.id);
                        }}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:cursor-pointer hover:bg-red-200 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
                        title="Delete"
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

      {/* Диалог добавления нового спринта (только для не-USER) */}
      {userRole !== "USER" && newSprintDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold">Новый спринт</h2>
            <div className="mb-4 grid gap-4">
              <input
                type="number"
                placeholder="Длительность (дни)"
                value={newSprint.daysInterval}
                onChange={(e) =>
                  setNewSprint({
                    ...newSprint,
                    daysInterval: Number(e.target.value),
                  })
                }
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Цель спринта"
                value={newSprint.purpose}
                onChange={(e) =>
                  setNewSprint({ ...newSprint, purpose: e.target.value })
                }
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
              <input
                type="date"
                placeholder="Дата окончания"
                value={newSprint.timeExpired}
                onChange={(e) =>
                  setNewSprint({ ...newSprint, timeExpired: e.target.value })
                }
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
              <select
                title="select"
                value={newSprint.priority}
                onChange={(e) =>
                  setNewSprint({
                    ...newSprint,
                    priority: Number(e.target.value),
                  })
                }
                className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="1">Приоритет 1</option>
                <option value="2">Приоритет 2</option>
                <option value="3">Приоритет 3</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewSprintDialogOpen(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:cursor-pointer hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Отмена
              </button>
              <button
                onClick={createSprint}
                disabled={!newSprint.purpose || !newSprint.timeExpired}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-emerald-700 disabled:bg-gray-400"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
