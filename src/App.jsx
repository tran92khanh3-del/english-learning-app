import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LessonPrint from './pages/LessonPrint.jsx';
import Exercises from './pages/Exercises.jsx';
import ExercisesPrint from './pages/ExercisesPrint.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="print:hidden bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-lg font-bold text-sky-700">
            📚 Trung Tâm Học &amp; In Tiếng Anh
          </Link>
          <Link to="/exercises" className="text-sm text-slate-600 hover:text-sky-700">
            Bài tập
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/print" element={<LessonPrint />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/print" element={<ExercisesPrint />} />
        </Routes>
      </main>
    </div>
  );
}
