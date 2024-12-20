# Cấu trúc cơ sở dữ liệu TechNews

## Mục lục

- [Cấu trúc cơ sở dữ liệu TechNews](#cấu-trúc-cơ-sở-dữ-liệu-technews)
  - [Mục lục](#mục-lục)
  - [Tổng quan](#tổng-quan)
  - [Cấu trúc các collection](#cấu-trúc-các-collection)
    - [1. Accounts](#1-accounts)
    - [2. Posts](#2-posts)
    - [3. Comments](#3-comments)
    - [4. Tags](#4-tags)
    - [5. Notifications](#5-notifications)
    - [6. AdminLogs](#6-adminlogs)
  - [Mối quan hệ giữa các collection](#mối-quan-hệ-giữa-các-collection)
    - [Users ↔ Posts](#users--posts)
    - [Posts ↔ Comments](#posts--comments)
    - [Posts ↔ Categories](#posts--categories)
    - [Users ↔ Notifications](#users--notifications)
  - [Indexes](#indexes)
    - [Index đơn lẻ:](#index-đơn-lẻ)
    - [Compound Index:](#compound-index)
  - [Câu lệnh cần chạy](#câu-lệnh-cần-chạy)

---

## Tổng quan
Ứng dụng **TechNews** sử dụng cơ sở dữ liệu MongoDB được thiết kế để hỗ trợ các chức năng cốt lõi như quản lý người dùng, tạo bài viết, tương tác bình luận và gửi thông báo. Tài liệu này mô tả cấu trúc của các collection chính trong cơ sở dữ liệu.

---

## Cấu trúc các collection

### 1. Accounts
Lưu trữ thông tin người dùng, bao gồm vai trò và trạng thái tài khoản.

**Cấu trúc:**
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "passwordHash": "String",
  "role": "String",
  "status": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date",
  "bookmarkedPosts": ["ObjectId"],
  "upvotedPosts": ["ObjectId"],
  "downvotedPosts": ["ObjectId"],
  "profile": {
    "name": "String",
    "avatar": "String",
    "bio": "String"
  },
  "isBanned": "Boolean"
}
```

---

### 2. Posts
Lưu trữ thông tin về các bài viết do người dùng gửi và được quản lý phê duyệt.

**Cấu trúc:**
```json
{
  "_id": "ObjectId",
  "title": "String",
  "thumbnail": "String",
  "content": "String",
  "authorId": "ObjectId",
  "tags": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date",
  "upvotesCount": "Number",
  "downvotesCount": "Number",
  "commentsID": ["ObjectId"],
  "totalCommentsCount": "Number",
  "bookmarkedByAcoountId": ["ObjectId"],
  "status": "String",
  "isDeleted": "Boolean"
}
```

---

### 3. Comments
Theo dõi các bình luận được đăng trên bài viết, bao gồm cả các phản hồi lồng nhau.

**Cấu trúc:**
```json
{
  "_id": "ObjectId",
  "postId": "ObjectId",
  "authorId": "ObjectId",
  "content": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "childCommentsId": ["ObjectId"],
  "descendantCommentsCount": "Number",
  "isDeleted": "Boolean",
  "upvotesCount": "Number",
  "downvotesCount": "Number"
}
```

---

### 4. Tags
Giúp phân loại các bài viết để dễ dàng tìm kiếm và tổ chức.

**Tags tạm thời:**
- Web & Mobile Development
- AI, Data & Machine Learning
- Backend & Databases
- Blockchain & Cybersecurity
- Others (Miscellaneous Tech)

**Cấu trúc:**
```json
{
  "_id": "ObjectId",
  "name": "String",
  "slug": "String"
}
```

---

### 5. Notifications
Gửi thông báo đến người dùng dựa trên các tương tác cụ thể.

**Loại thông báo hỗ trợ:**
- Bình luận mới trên bài viết của người dùng.
- Nhận upvote trên bài viết hoặc bình luận.
- Phê duyệt hoặc từ chối bài viết.

**Cấu trúc:**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "message": "String",
  "type": "String",
  "referenceId": "ObjectId",
  "isRead": "Boolean",
  "createdAt": "Date"
}
```

---

### 6. AdminLogs
Ghi lại các hành động của Admin để phục vụ mục đích quản lý và kiểm tra.

**Cấu trúc:**
```json
{
  "_id": "ObjectId",
  "adminId": "ObjectId",
  "action": "String",
  "target": "ObjectId",
  "description": "String",
  "createdAt": "Date"
}
```

---

## Mối quan hệ giữa các collection

### Users ↔ Posts
- Mỗi bài viết thuộc về một người dùng (author).
- Một người dùng có thể bookmark hoặc upvote nhiều bài viết.

### Posts ↔ Comments
- Một bài viết có thể có nhiều bình luận.
- Mỗi bình luận thuộc về một bài viết và một người dùng.

### Posts ↔ Categories
- Mỗi bài viết thuộc về một danh mục.

### Users ↔ Notifications
- Mỗi thông báo thuộc về một người dùng.

---

## Indexes

### Index đơn lẻ:
- **Users**: email, username.
- **Posts**: status, tags, category.
- **Comments**: postId.

### Compound Index:
- **Posts**: `{ category: 1, createdAt: -1 }` để phân loại và sắp xếp bài viết.

---

## Câu lệnh cần chạy

1. Cài đặt **migrate-mongo**:
```bash
npm install migrate-mongo --save-dev
```

2. Khởi tạo thư mục migrate-mongo:
```bash
npx migrate-mongo init
```

3. Cài đặt dotenv:
```bash
npm install dotenv --save
```

4. Tạo tệp migration mới:
```bash
npx migrate-mongo create create-core-collections
```

5. Chạy migration:
```bash
npx migrate-mongo up -f src\config\migrate-mongo-config.js
```

6. Hoàn tác migration (nếu cần):
```bash
npx migrate-mongo down -f src\config\migrate-mongo-config.js
```

7. Cài đặt cloudinary:
```bash
npm install cloudinary
```

