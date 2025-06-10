import { MyFooter } from "../components/Footer";
import { Header } from "../components/Header";
import { useParams, useNavigate } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../utils/jwthandle";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  creator: User;
  metaDB: {
    idProject: number;
    localDate: string;
  };
}

interface RoleResponse {
  user: User;
  granted: "SUPER_USER" | "SUB_SUPER_USER" | "USER";
}

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<
    "SUPER_USER" | "SUB_SUPER_USER" | "USER" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("SCRUM-мастер");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        // Получаем данные проекта
        const projectResponse = await api.get<Project>(`/project/${id}/get`);
        setProject(projectResponse.data);

        // Получаем роль пользователя
        const roleResponse = await api.get<RoleResponse>(
          `/user/get_role/${id}`,
        );
        setUserRole(roleResponse.data.granted);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные проекта");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteProject = async () => {
    if (
      !id ||
      !window.confirm(
        "Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/project/${id}/delete`);
      navigate("/"); // Перенаправляем на главную после удаления
    } catch (err) {
      console.error("Ошибка при удалении проекта:", err);
      setError("Не удалось удалить проект");
    }
  };

  const generateInviteLink = async () => {
    if (!id || isGenerating) return;

    // Преобразуем выбранную роль в значение для API
    const apiRole = selectedRole === "SCRUM-мастер" ? "SUB_SUPER_USER" : "USER";

    setIsGenerating(true);
    try {
      const response = await api.get<string>(`/project/${id}/shared`, {
        params: {
          role: apiRole, // Используем преобразованное значение
        },
      });
      setGeneratedLink(response.data);
    } catch (err) {
      console.error("Ошибка при генерации ссылки:", err);
      setError("Не удалось сгенерировать ссылку");
    } finally {
      setIsGenerating(false);
    }
  };
  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard
      .writeText(`http://localhost:5173${generatedLink}`)
      .then(() => alert("Ссылка скопирована в буфер обмена"))
      .catch(() => alert("Не удалось скопировать ссылку"));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="text-xl">Загрузка данных проекта...</div>
        </div>
        <MyFooter />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
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
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6 dark:text-white">
        {id !== undefined ? <Sidebar id={id} /> : null}
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            {/* Заголовок и основная информация */}
            <div className="mb-8 w-full">
              <div className="flex items-start justify-between">
                <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
                  <span className="rounded px-2 py-1">
                    {project?.name || "Имя проекта"}
                  </span>
                </h1>

                {userRole === "SUPER_USER" && (
                  <button
                    onClick={handleDeleteProject}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    Удалить проект
                  </button>
                )}
              </div>

              <div className="mb-4 flex items-center text-gray-600 dark:text-gray-300">
                <span className="font-medium">Создатель:</span>
                <span className="ml-2 rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">
                  {project?.creator.name || "Имя создателя"}
                </span>
              </div>

              <p className="rounded-lg border border-gray-200 p-4 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                {userRole === "USER" ? (
                  <>
                    Добро пожаловать в проект! Здесь вы можете участвовать в
                    разработке и сотрудничать с другими участниками команды.
                    Если у вас есть вопросы, обратитесь к создателю проекта.
                  </>
                ) : (
                  <>
                    К проекту имеют доступ только приглашённые пользователи. Для
                    того, чтобы пригласить пользователя, выберите его роль и
                    нажмите "сгенерировать ссылку". После этого скопируйте
                    ссылку и отправьте её пользователю. При переходе
                    пользователя по ссылке он будет добавлен в ваш проект с
                    соответствующей ролью.
                  </>
                )}
              </p>
            </div>

            {/* Генерация ссылки (только для SUPER_USER и SUB_SUPER_USER) */}
            {(userRole === "SUPER_USER" || userRole === "SUB_SUPER_USER") && (
              <div className="w-2/3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-700">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Доступ к проекту
                </h2>

                <div className="mb-4">
                  <button
                    onClick={generateInviteLink}
                    disabled={isGenerating}
                    className={`rounded-lg px-4 py-2 text-white transition-colors hover:cursor-pointer focus:outline-none ${
                      isGenerating
                        ? "cursor-not-allowed bg-emerald-400 dark:bg-emerald-500"
                        : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                    }`}
                  >
                    {isGenerating
                      ? "Генерация..."
                      : "Сгенерировать ссылку для доступа"}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Выберите роль для предоставления доступа:
                  </label>
                  <select
                    value={selectedRole}
                    title="select"
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500"
                  >
                    <option value="SCRUM-мастер">SCRUM-мастер</option>
                    <option value="Разработчик">Разработчик</option>
                  </select>
                </div>

                {generatedLink && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ссылка для доступа:
                    </p>
                    <div className="mt-2 truncate overflow-hidden rounded-lg border border-gray-300 bg-gray-100 p-3 font-mono text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                      http://localhost:5173{generatedLink}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="mt-2 text-sm text-emerald-600 hover:cursor-pointer hover:underline dark:text-emerald-400"
                    >
                      Скопировать ссылку
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
