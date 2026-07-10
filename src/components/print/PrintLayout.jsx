/**
 * Khung trang in khổ A4. Trên màn hình hiển thị như một "tờ giấy" ở giữa;
 * khi in (@media print) bỏ bóng/nền, dùng đúng khổ A4 với lề hợp lý.
 * Mọi UI điều khiển phải nằm NGOÀI component này (hoặc đánh print:hidden).
 */
export default function PrintLayout({ children }) {
  return (
    <div className="print-sheet mx-auto my-6 bg-white text-black shadow-lg print:my-0 print:shadow-none">
      {children}
    </div>
  );
}
