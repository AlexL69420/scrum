import { MyFooter } from "./components/Footer";
import { Header } from "./components/Header";
import ProjectList from "./components/ProjectList";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 bg-gradient-to-r from-slate-200 to-slate-200 text-black dark:from-slate-500 dark:to-slate-800 dark:text-white">
      <Header />
      <div className="flex w-full flex-row justify-center gap-4">
        <ProjectList />
      </div>
      <MyFooter />
    </main>
  );
}
