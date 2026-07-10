import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LessonPrint from './pages/LessonPrint.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="print:hidden bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-lg font-bold text-sky-700">
            📚 Trung Tâm Học &amp; In Tiếng Anh
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/print" element={<LessonPrint />} />
        </Routes>
      </main>
    </div>
  );
}
