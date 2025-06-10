import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiClock, FiPlus } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../utils/jwthandle";
import { isAuthenticated } from "../utils/auth";

interface IProject {
  id: number;
  name: string;
  creator: {
    id: number;
    name: string;
  };
  metaDB: {
    idProject: number;
    localDate: string;
  } | null;
}

export default function ProjectList() {
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await api.get<IProject[]>("/project/get_all");
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load projects with error ${err}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4 dark:bg-gray-800">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-2/3 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isAuthenticated() ? "Мои проекты" : "Проекты"}
          </h1>
          {isAuthenticated() && (
            <button
              onClick={() => navigate("/create-project")}
              className="flex items-center rounded bg-emerald-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <FiPlus className="mr-2" />
              Создать проект
            </button>
          )}
        </div>

        {!isAuthenticated() ? (
          <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to view and create projects.
            </p>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => navigate("/auth")}
                className="rounded bg-emerald-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Войти
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:cursor-pointer hover:bg-gray-300 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700"
              >
                Регистрация
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white p-4 shadow dark:bg-gray-700"
              >
                <Skeleton
                  height={30}
                  width={200}
                  baseColor="#f3f4f6"
                  highlightColor="#e5e7eb"
                  className="dark:bg-gray-600"
                />
                <div className="mt-2 flex items-center">
                  <Skeleton
                    circle
                    width={20}
                    height={20}
                    baseColor="#f3f4f6"
                    highlightColor="#e5e7eb"
                    className="dark:bg-gray-600"
                  />
                  <Skeleton
                    width={100}
                    className="ml-2 dark:bg-gray-600"
                    baseColor="#f3f4f6"
                    highlightColor="#e5e7eb"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="custom-scrollbar space-y-4 overflow-y-auto pb-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg bg-white p-4 shadow transition-all hover:shadow-md dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {project.name}
                      </h2>
                      <FiChevronRight className="ml-1 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span>Created by {project.creator.name}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>
                          {project.metaDB?.localDate || "No date available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              No projects found. Create your first project!
            </p>
            <button
              onClick={() => navigate("/create-project")}
              className="mt-4 rounded bg-emerald-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-emerald-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
