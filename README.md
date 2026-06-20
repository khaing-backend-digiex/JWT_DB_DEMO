# JWT Authentication Demo
Dự án này là một API RESTful được xây dựng bằng Node.js, Express, và TypeScript, sử dụng PostgreSQL làm cơ sở dữ liệu. Nó cung cấp các chức năng CRUD cơ bản cho Books, Authors và Users, đồng thời minh họa cách triển khai xác thực (Authentication) bằng JSON Web Token (JWT).

## Công nghệ sử dụng
- **Ngôn ngữ:** TypeScript, Node.js
- **Framework:** Express.js
- **Cơ sở dữ liệu:** PostgreSQL (kết hợp với pg và pg-promise)
- **Xác thực:** jsonwebtoken (JWT), bcryptjs (mã hóa mật khẩu)
- **Migrations:** node-pg-migrate

## Yêu cầu hệ thống
- Node.js (phiên bản 18+ khuyến nghị)
- PostgreSQL

## Hướng dẫn cài đặt

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình biến môi trường
Tạo một file `.env` ở thư mục gốc của dự án dựa trên file `env.example`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/dbname
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

### Chạy Database Migrations
Dự án sử dụng `node-pg-migrate` để quản lý schema database. Chạy lệnh sau để tạo các bảng cần thiết trong database:

```bash
npm run migration:up
```

## Chạy ứng dụng

- **Môi trường phát triển (Development):** Tự động build lại mã TypeScript và restart server khi có thay đổi.
  ```bash
  npm run dev
  ```

- **Môi trường sản phẩm (Production):** Build mã TypeScript và chạy bản đã được biên dịch.
  ```bash
  npm run build
  npm start
  ```

## Cấu trúc thư mục (src)
- `routes/`: Định nghĩa các API endpoints (Auth, User, Book, Author).
- `controller/`: Nhận request, gọi service xử lý logic và trả về response.
- `service/`: Chứa các logic nghiệp vụ (business logic).
- `repository/`: Tương tác trực tiếp với cơ sở dữ liệu.
- `middleware/`: Chứa các middleware (như bắt lỗi, xác nhận JWT).
- `dto/`: Data Transfer Objects dùng để validate hoặc định dạng dữ liệu đầu vào.
- `interface/` (hoặc `entity/`): Các mô hình thực thể cơ bản.
- `exception/`: Custom error classes.
- `config/` (hoặc file cấu hình): Cấu hình hệ thống và môi trường.
- `constant/`: Các hằng số được sử dụng trong dự án.

## API Endpoints chính
Mặc định API sẽ chạy tại prefix `/api` (ví dụ: `http://localhost:3000/api`).

- **Auth:** Đăng ký, Đăng nhập (`/api/register`, `/api/login`)
- **Users:** Quản lý thông tin người dùng (`/api/user`)
- **Books:** Quản lý sách (`/api/book`)
- **Authors:** Quản lý tác giả (`/api/author`)
- **Categories:** Quản lý danh mục (`/api/category`)
