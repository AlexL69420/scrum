import { MyFooter } from "./components/Footer";
import { Header } from "./components/Header";

export default function App() {
  return(
  <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-[url('../public/r4hKeWNno9Q.jpg')] bg-[url('../public/sVS14Gr_9E8.jpg')] bg-cover bg-center bg-no-repeat">
    <Header />
    <div className="flex min-h-screen w-3/5 flex-col items-center gap-4 rounded bg-gradient-to-r from-emerald-100 to-emerald-500  px-2 py-3 text-black dark:from-emerald-500 dark:to-emerald-800 dark:text-white">

    </div>
    <MyFooter />
  </main>
  );
}
