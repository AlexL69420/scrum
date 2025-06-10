import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import api from "../utils/jwthandle";
import { Header } from "../components/Header";
import { MyFooter } from "../components/Footer";
import { isAuthenticated } from "../utils/auth";

interface IProjectCreateResponse {
  id: number;
  name: string;
  creator: {
    id: number;
    name: string;
  };
  metaDB: {
    idProject: number;
    localDate: string;
  };
}

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (!isAuthenticated()) {
      setError("You must be logged in to create a project");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
      // Получаем данные пользователя только при отправке формы
      const userResponse = await api.get("/auth/me");
      const userInfo = userResponse.data;

      const newProject = {
        name: name.trim(),
        creator: {
          id: userInfo.id,
          name: userInfo.name,
        },
        metaDB: {
          idProject: 0,
          localDate: new Date().toISOString().split("T")[0],
        },
      };*/
      const newProject = {
        name: name.trim(),
      };

      const response = await api.post<IProjectCreateResponse>(
        "/project/create",
        newProject,
      );

      navigate(`/project/${response.data.id}`);
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error("Project creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-screen flex-col gap-2 bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="mx-auto max-w-md pt-10">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
              Создать новый проект
            </h2>
            <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100">
              You must be logged in to create a project
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => navigate("/auth")}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Войти
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Регистрация
              </button>
            </div>
          </div>
        </div>
        <MyFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-2 bg-gray-50 p-4 dark:bg-gray-900">
      <Header />
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center text-gray-600 hover:cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
          Вернуться к проектам
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
              Создание проекта
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="projectName"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="My Awesome Project"
                  maxLength={100}
                  disabled={isSubmitting}
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {name.length}/100 characters
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:ring-emerald-800"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      Создать проект
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Project Naming Guide
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
                <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-200">
                  Good Examples
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Customer Portal Redesign</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>E-commerce Analytics Dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Mobile App UI Components</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <h4 className="mb-2 font-medium text-amber-800 dark:text-amber-200">
                  Tips
                </h4>
                <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Be specific about the project's purpose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Keep it short but descriptive (3-5 words)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use title case for better readability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Avoid special characters and abbreviations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </div>
  );
}
