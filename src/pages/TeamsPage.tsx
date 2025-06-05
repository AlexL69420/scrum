import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MyFooter } from "../components/Footer";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../utils/jwthandle";

interface UserRole {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  granted: "USER" | "ADMIN" | "SUPER_USER";
}

interface TeamMember {
  idTeam: number;
  id: number;
  nameUser: string;
  nameEmployee: string;
  idRole: number;
}

interface Team {
  id: number;
  name: string;
  idTask: number;
  hiredEmployeeDTOList: TeamMember[];
}

interface UserTask {
  id: number;
  idSprint: number;
  status: string;
  detail: string;
}

export function TeamsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем роль пользователя
        const roleResponse = await api.get(`/user/get_role/${projectId}`);
        setUserRole(roleResponse.data);

        if (roleResponse.data.granted !== "USER") {
          // Для ADMIN и SUPER_USER загружаем все команды
          try {
            const teamsResponse = await api.get(`/team/${projectId}/get_all`);
            setTeams(
              Array.isArray(teamsResponse.data) ? teamsResponse.data : [],
            );
          } catch (teamsError) {
            console.error("Error fetching teams:", teamsError);
            setTeams([]);
          }
        } else {
          // Для USER загружаем его команду через задачи
          try {
            // Получаем задачи пользователя
            const tasksResponse = await api.get(
              `/task_board/${projectId}/get_task_command`,
            );
            const userTasks: UserTask[] = tasksResponse.data;

            if (userTasks.length > 0) {
              // Берем первую задачу (предполагаем, что пользователь в одной команде)
              const firstTaskId = userTasks[0].id;
              // Получаем команду по ID задачи
              const teamResponse = await api.get(
                `/team/${projectId}/get_user_team?id_task=${firstTaskId}`,
              );
              setUserTeam(teamResponse.data);
            }
          } catch (userTeamError) {
            console.error("Error fetching user team:", userTeamError);
            setUserTeam(null);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
        <Header />
        <div className="text-xl">Загрузка...</div>
        <MyFooter />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
        <Header />
        <div className="text-xl text-red-500">{error}</div>
        <MyFooter />
      </main>
    );
  }

  const renderTeam = (team: Team) => (
    <div
      key={team.id}
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-700"
    >
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">{team.name}</h2>
        {userRole?.granted !== "USER" && (
          <button className="text-sm text-red-600 dark:text-red-400">
            Удалить
          </button>
        )}
      </div>

      <div className="space-y-2">
        {team.hiredEmployeeDTOList?.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-gray-600"
          >
            <span>
              {member.nameEmployee} ({member.nameUser})
            </span>
            {userRole?.granted !== "USER" && (
              <button className="text-sm text-red-600 dark:text-red-400">
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>

      {userRole?.granted !== "USER" && (
        <button className="mt-3 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600">
          + Добавить участника
        </button>
      )}
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex min-h-screen min-w-screen flex-row gap-4 px-2 py-6">
        {projectId !== undefined ? <Sidebar id={projectId} /> : null}
        <div className="flex w-full justify-center">
          <div className="flex h-[calc(100vh-64px)] w-2/3 flex-col items-center overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-6 flex w-full items-center justify-between">
              <h1 className="text-3xl font-bold">Команды проекта</h1>
              {userRole?.granted !== "USER" && (
                <button className="rounded bg-emerald-600 px-4 py-2 text-white">
                  Создать команду
                </button>
              )}
            </div>

            {userRole?.granted === "USER" ? (
              userTeam ? (
                <div className="grid w-full grid-cols-1 gap-4">
                  {renderTeam(userTeam)}
                </div>
              ) : (
                <div className="text-lg">
                  Вы не состоите ни в одной команде проекта
                </div>
              )
            ) : teams.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                {teams.map(renderTeam)}
              </div>
            ) : (
              <div className="text-lg">Нет команд в проекте</div>
            )}
          </div>
        </div>
      </div>
      <MyFooter />
    </main>
  );
}
