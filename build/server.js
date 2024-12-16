import express from 'express';
import path from 'path';
// Lấy đường dẫn thư mục hiện tại thay cho __dirname
const __dirname = new URL('.', import.meta.url).pathname;
const app = express();
const port = 3000;
// Middleware để phục vụ các file tĩnh (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
// Route chính để gửi file HTML khi người dùng truy cập vào root ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Khởi động server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map