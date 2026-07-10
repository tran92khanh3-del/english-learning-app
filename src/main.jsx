// Shim Buffer tối thiểu cho trình duyệt: gray-matter gọi Buffer.from khi parse.
// Việc parse xảy ra lúc render (sau khi module này chạy) nên gán ở đây là đủ,
// tránh phải thêm polyfill 'buffer' làm nặng bundle.
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = { from: (s) => s, isBuffer: () => false };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './assets/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
