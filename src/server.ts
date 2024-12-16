
import express from 'express';
import path from 'path';
import { UsersDatabase } from './db/UsersDatabase.js';
import { User } from './db/UsersDatabase.js';
import { PlannersDatabse } from './db/PlannersDatabase.js';


// Lấy đường dẫn thư mục hiện tại thay cho __dirname
const __dirname = new URL('.', import.meta.url).pathname;

const app = express();
const port = 3000;

// Cấu hình EJS làm template engine
app.set('view engine', 'ejs');
app.set('views', path.join(new URL('.', import.meta.url).pathname, 'views'));

// Cấu hình thư mục tĩnh (static folder) để phục vụ CSS, JS, hình ảnh
app.use(express.static(path.join(new URL('.', import.meta.url).pathname, 'public')));


// Middleware để xử lý dữ liệu từ body (nếu có)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route chính trả về trang EJS
app.get('/', (req, res) => {
  const user = { name: 'John Doe', age: 30 };
  const planners = [
    { id: 1, name: 'Trip to Paris', cost: 1000 },
    { id: 2, name: 'Mountain Hiking', cost: 200 }
  ];

  res.render('index', { user, planners });
});

app.get('/api-v1/addCard', (req, res) => {});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const UserDB = new UsersDatabase();
const PlannerDB = new PlannersDatabse();



