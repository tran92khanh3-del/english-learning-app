import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LessonPrint from './pages/LessonPrint.jsx';
import Exercises from './pages/Exercises.jsx';
import ExercisesPrint from './pages/ExercisesPrint.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-800">
      <header className="print:hidden bg-white border-b-4 border-sky-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link to="/" className="text-xl font-extrabold text-sky-700 flex items-center gap-2">
            <span className="text-2xl">📚</span> Trung Tâm Học &amp; In Tiếng Anh
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Link
              to="/exercises"
              className="px-4 py-2 rounded-full text-sm font-bold text-white bg-orange-400 shadow-pop hover:bg-orange-500 active:translate-y-0.5 active:shadow-none transition"
            >
              ✏️ Bài tập
            </Link>
            <Link
              to="/settings"
              className="px-4 py-2 rounded-full text-sm font-bold text-white bg-violet-400 shadow-pop hover:bg-violet-500 active:translate-y-0.5 active:shadow-none transition"
            >
              ⚙️ Cài đặt
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/print" element={<LessonPrint />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/print" element={<ExercisesPrint />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
