# JWT Authentication & Role-Based Access Control Demo

Dự án này là một API RESTful được xây dựng bằng **Node.js, Express, và TypeScript**, sử dụng **PostgreSQL** làm cơ sở dữ liệu. Nó cung cấp các chức năng CRUD cơ bản cho Books, Authors, Categories và Users. Hệ thống được trang bị phân quyền chặt chẽ (RBAC) bằng **JSON Web Token (JWT)** cùng với cơ chế xử lý lỗi toàn cầu (Global Error Handler).

## Công nghệ sử dụng
- **Ngôn ngữ:** TypeScript, Node.js
- **Framework:** Express.js
- **Cơ sở dữ liệu:** PostgreSQL (kết hợp với pg-promise)
- **Xác thực & Phân quyền:** jsonwebtoken (JWT), bcryptjs (mã hóa mật khẩu)
- **Migrations:** node-pg-migrate

## Các Tính Năng Nổi Bật (Mới Cập Nhật)
1. **Phân Quyền Theo Role (RBAC):**
   - **Admin:** Toàn quyền hệ thống.
   - **Manager:** Quản lý mọi thứ (trừ việc không thể Xóa/Sửa tài khoản của Admin và các Manager khác).
   - **User:** Chỉ có thể Sửa/Xem thông tin của chính mình, và đặc biệt: **Chỉ có thể Sửa/Xóa những cuốn sách do chính mình tạo ra** (Tính năng Ownership bảo mật thông qua cột `created_by`).
2. **Public API (Dành cho khách):**
   - Các API lấy danh sách Sách (`GET /book`) và Tác giả (`GET /author`) được mở công khai, không yêu cầu đăng nhập.
3. **Global Exception Handling:**
   - Thay vì lạm dụng `try...catch` ở từng Controller, dự án sử dụng custom wrapper `catchAsync` kết hợp cùng `AppException`.
   - Mọi lỗi trên toàn bộ hệ thống đều được hứng tập trung tại `globalErrorHandler` để trả về phản hồi `JSON` đạt chuẩn thống nhất.

## Hướng dẫn cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo một file `.env` ở thư mục gốc của dự án dựa trên các biến sau:

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

### 3. Chạy Database Migrations
Dự án sử dụng `node-pg-migrate` để quản lý schema database. Chạy lệnh sau để khởi tạo bảng và thêm các cột cần thiết (như `created_by`):

```bash
npm run migration:up
```

*(Lưu ý: Nếu cần tạo migration mới, chạy lệnh `npm run migration:create -- <tên-migration>`)*

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

## Cấu trúc thư mục (`src`)
- `routes/`: Định nghĩa các API endpoints (Auth, User, Book, Author, Category).
- `controller/`: Gọn nhẹ, hứng Request và gọi logic từ Service (bọc bằng `catchAsync`).
- `service/`: Nơi chứa toàn bộ Business Logic và kiểm tra Ownership của sách.
- `repository/`: Tương tác trực tiếp với cơ sở dữ liệu qua các câu lệnh SQL.
- `middleware/`: Chứa `globalErrorHandler`, `authMiddleware` (xác thực token), và `authorizeDynamic` (phân quyền linh hoạt).
- `dto/`: Data Transfer Objects.
- `interface/` (hoặc `models/`): Các Type interfaces của TypeScript.
- `exception/`: Chứa lớp `AppException`.
- `utils/`: Các hàm tiện ích dùng chung (`catchAsync`).
- `constant/`: Khai báo các `Enum` chuẩn hóa (`HttpStatus`, `ErrorMessage`, `Role`).

## API Endpoints
Mặc định API chạy tại `http://localhost:3000/api`. Tất cả các route đều được nhóm trong prefix `/api`.

- **Auth:** 
  - `POST /api/register` (Đăng ký tài khoản)
  - `POST /api/login` (Đăng nhập, trả về JWT)
- **Users:** 
  - `GET/PUT/DELETE /api/user` (Cần Token. User chỉ thao tác được với dữ liệu của mình)
- **Books:** 
  - `GET /api/book` **(Public - Không cần Token)**
  - `POST /api/book` (Cần Token. Sách tạo ra sẽ tự động gắn `created_by` là ID của bạn)
  - `PUT/DELETE /api/book?id=...` (Cần Token. Chỉ thao tác được nếu bạn là người tạo, hoặc mang role Manager/Admin)
- **Authors:** 
  - `GET /api/author` và `GET /api/author/:id` **(Public - Không cần Token)**
  - `POST/PUT/DELETE /api/author` (Cần Token)
- **Categories:** 
  - `GET/POST/PUT/DELETE /api/category` (Cần Token)
