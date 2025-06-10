import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import api from "../utils/jwthandle";
import { useNavigate } from "react-router-dom";

interface ProjectUser {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  granted: "SUPER_USER" | "SUB_SUPER_USER" | "USER";
}

export function MembersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState<ProjectUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<
    "SUPER_USER" | "SUB_SUPER_USER" | "USER" | null
  >(null);

  // Загрузка участников проекта
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!id) return;

        // Загружаем список участников и их роли
        const response = await api.get<ProjectUser[]>(
          `/project/${id}/get_user_role`,
        );
        setMembers(response.data);

        // Определяем роль текущего пользователя (первый элемент массива - текущий пользователь)
        if (response.data.length > 0) {
          setCurrentUserRole(response.data[0].granted);
        }
      } catch (err) {
        console.error("Ошибка при загрузке участников:", err);
        setError("Не удалось загрузить список участников");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [id]);

  const getRoleName = (role: string) => {
    switch (role) {
      case "SUPER_USER":
        return "Создатель";
      case "SUB_SUPER_USER":
        return "Scrum Master";
      case "USER":
        return "Разработчик";
      default:
        return role;
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого участника?"))
      return;

    try {
      // Здесь должен быть запрос на удаление участника
      // await api.delete(`/project/${id}/remove_member/${userId}`);

      // Временно обновляем локальное состояние
      setMembers(members.filter((member) => member.user.id !== userId));
    } catch (err) {
      console.error("Ошибка при удалении участника:", err);
      setError("Не удалось удалить участника");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="text-xl">Загрузка участников...</div>
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
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        {id !== undefined ? <Sidebar id={id} /> : null}
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            <h1 className="mb-6 text-3xl font-bold">Участники проекта</h1>

            <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-700">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-xl font-semibold">Список участников</h2>
                {currentUserRole !== "USER" && (
                  <button
                    onClick={() => navigate(`/project/${id}`)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-emerald-700"
                  >
                    Пригласить участника
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.user.id}
                    className="flex flex-col items-start justify-between gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getRoleName(member.granted)} • {member.user.email}
                      </p>
                    </div>

                    {currentUserRole === "SUPER_USER" &&
                      member.granted !== "SUPER_USER" && (
                        <button
                          onClick={() => handleRemoveMember(member.user.id)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-800/50"
                        >
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
