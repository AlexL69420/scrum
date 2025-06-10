import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/jwthandle";
import { isAuthenticated } from "../utils/auth";

export function SharePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const processInvitation = async () => {
      if (!token) {
        navigate("/"); // Если нет токена, перенаправляем на главную
        return;
      }

      if (!isAuthenticated()) {
        // Если не авторизован, перенаправляем на страницу входа
        navigate("/auth");
        return;
      }

      try {
        // Делаем запрос для присоединения к проекту
        const response = await api.post(`/project/assign?token=${token}`);

        // Перенаправляем на страницу проекта после успешного присоединения
        if (response.data?.id) {
          navigate(`/project/${response.data.id}`);
        } else {
          throw new Error("Не удалось получить ID проекта");
        }
      } catch (error) {
        console.error("Ошибка при обработке приглашения:", error);
        navigate("/", { state: { error: "Не удалось принять приглашение" } });
      }
    };

    processInvitation();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-700">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Обработка приглашения
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Пожалуйста, подождите, мы обрабатываем ваше приглашение...
        </p>
        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}
