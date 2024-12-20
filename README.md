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
    - [5. Categories](#5-categories)
    - [6. Notifications](#6-notifications)
  - [Mối quan hệ giữa các collection](#mối-quan-hệ-giữa-các-collection)
    - [1. **Users ↔ Posts**](#1-users--posts)
    - [2. **Posts ↔ Comments**](#2-posts--comments)
    - [3. **Posts ↔ Categories**](#3-posts--categories)
    - [4. **Posts ↔ Tags**](#4-posts--tags)
    - [5. **Users ↔ Notifications**](#5-users--notifications)
  - [Sơ đồ mối quan hệ](#sơ-đồ-mối-quan-hệ)
  - [Indexes](#indexes)
    - [Index đơn lẻ:](#index-đơn-lẻ)
    - [Index kết hợp:](#index-kết-hợp)
  - [Câu lệnh cần chạy](#câu-lệnh-cần-chạy)
  - [Các lưu ý khi triển khai cơ sở dữ liệu](#các-lưu-ý-khi-triển-khai-cơ-sở-dữ-liệu)
    - [1. Tài khoản test (hiện tại có 2 tài khoản cho mỗi vai trò):](#1-tài-khoản-test-hiện-tại-có-2-tài-khoản-cho-mỗi-vai-trò)
    - [2. Sử dụng BFS (Breadth-First Search) để tính số comment con:](#2-sử-dụng-bfs-breadth-first-search-để-tính-số-comment-con)
    - [3. Tính số comment của bài viết:](#3-tính-số-comment-của-bài-viết)
    - [4. Cập nhật và duy trì mối quan hệ giữa các collection:](#4-cập-nhật-và-duy-trì-mối-quan-hệ-giữa-các-collection)
    - [5. Quản lý trạng thái bài viết và bình luận:](#5-quản-lý-trạng-thái-bài-viết-và-bình-luận)
    - [6. Quản lý thông báo (notifications):](#6-quản-lý-thông-báo-notifications)
    - [7. Quản lý quyền truy cập và vai trò:](#7-quản-lý-quyền-truy-cập-và-vai-trò)
    - [8. Cập nhật mối quan hệ giữa các collection khi thay đổi dữ liệu:](#8-cập-nhật-mối-quan-hệ-giữa-các-collection-khi-thay-đổi-dữ-liệu)
    - [9. Cải thiện hiệu suất khi truy vấn:](#9-cải-thiện-hiệu-suất-khi-truy-vấn)

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
  "categoryId": "ObjectId",
  "tagsId": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date",
  "upvotesCount": "Number",
  "downvotesCount": "Number",
  "commentsId": ["ObjectId"],
  "totalCommentsCount": "Number",
  "bookmarkedByAccountId": ["ObjectId"],
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

**Cấu trúc:**
```json
{
  "_id": "ObjectId",        // ID duy nhất của tag
  "name": "String",         // Tên tag
  "slug": "String",         // Slug thân thiện với URL
  "isActive": "Boolean"     // Trạng thái hoạt động của tag (True = hoạt động, False = không hoạt động)
}
```

---

### 5. Categories
Giúp phân loại các bài viết để dễ dàng tìm kiếm và tổ chức.

**Cấu trúc:**
```json
{
  "_id": "ObjectId",        // ID duy nhất của category
  "name": "String",         // Tên của category
  "slug": "String",         // Slug thân thiện với URL
  "isActive": "Boolean"     // Trạng thái hoạt động của category (True = hoạt động, False = không hoạt động)
}
```

---

### 6. Notifications
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

## Mối quan hệ giữa các collection

### 1. **Users ↔ Posts**
- **Mối quan hệ**: Một người dùng có thể viết nhiều bài viết, nhưng mỗi bài viết chỉ có một tác giả (user).
- **Chi tiết**:
  - Một **bài viết** (post) thuộc về một **người dùng** (authorId).
  - Một **người dùng** có thể **bookmark** hoặc **upvote** nhiều bài viết. Các trường như `bookmarkedPosts`, `upvotedPosts`, và `downvotedPosts` trong collection **Accounts** lưu trữ các bài viết mà người dùng quan tâm hoặc đã đánh giá.

---

### 2. **Posts ↔ Comments**
- **Mối quan hệ**: Một bài viết có thể có nhiều bình luận. Mỗi bình luận sẽ thuộc về một bài viết cụ thể.
- **Chi tiết**:
  - Một **bài viết** có thể có nhiều **bình luận** (comments), được lưu trữ trong trường `commentsId` của collection **Posts**.
  - Mỗi **bình luận** thuộc về một **bài viết** (postId) và một **người dùng** (authorId). Trường `postId` trong collection **Comments** trỏ tới bài viết gốc mà bình luận này liên quan đến.
  - **Bình luận có thể có bình luận con** (child comments), được lưu trữ trong trường `childCommentsId`, giúp theo dõi mối quan hệ giữa các bình luận lồng nhau.

---

### 3. **Posts ↔ Categories**
- **Mối quan hệ**: Một bài viết thuộc về một danh mục (category).
- **Chi tiết**:
  - Mỗi **bài viết** có một trường `categoryId`, trỏ tới một **danh mục** (category) trong collection **Categories**.
  - **Danh mục** giúp phân loại bài viết để dễ dàng tìm kiếm và tổ chức bài viết trong hệ thống.

---

### 4. **Posts ↔ Tags**
- **Mối quan hệ**: Một bài viết có thể có nhiều tag, giúp phân loại bài viết.
- **Chi tiết**:
  - Mỗi **bài viết** có một mảng `tagsId`, trỏ tới các **tags** trong collection **Tags**.
  - **Tags** giúp phân loại bài viết để dễ dàng tìm kiếm và tổ chức bài viết trong hệ thống.

---

### 5. **Users ↔ Notifications**
- **Mối quan hệ**: Mỗi thông báo (notification) thuộc về một người dùng cụ thể.
- **Chi tiết**:
  - Mỗi **thông báo** (notification) có trường `userId`, trỏ tới người dùng (user) mà thông báo đó liên quan.
  - Thông báo có thể là về các sự kiện như nhận **upvote** trên bài viết hoặc bình luận của người dùng, nhận **bình luận mới** trên bài viết của người dùng, hoặc thông báo về **phê duyệt hoặc từ chối bài viết**.
  - Trường `isRead` giúp theo dõi trạng thái đã đọc hay chưa của thông báo.

---

## Sơ đồ mối quan hệ

1. **Users ↔ Posts**:
   - Một **user** có thể tạo nhiều **post**.
   - Một **post** có một **author** (user).
   
2. **Posts ↔ Comments**:
   - Một **post** có thể có nhiều **comments**.
   - Mỗi **comment** thuộc về một **post** và một **user**.
   
3. **Posts ↔ Categories**:
   - Một **post** thuộc về một **category**.
   
4. **Posts ↔ Tags**:
   - Một **post** có thể có nhiều **tags**.
   
5. **Users ↔ Notifications**:
   - Một **user** có thể nhận nhiều **notifications**.
   - Một **notification** thuộc về một **user**.

---

## Indexes

### Index đơn lẻ:
- **Users**: email, username.
- **Posts**: status, tags, category.
- **Comments**: postId.

### Index kết hợp:
- **Posts**: `{ category: 1, createdAt: -1 }` để phân loại và sắp xếp bài viết.

---

## Câu lệnh cần chạy

1. Cài đặt **migrate-mongo**:
```bash
npm install migrate-mongo --save-dev
```

2. Khởi tạo thư mục **migrate-mongo**:
```bash
npx migrate-mongo init
```

3. Cài đặt **dotenv**:
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

7. Cài đặt **cloudinary**:
```bash
npm install cloudinary
```

---

## Các lưu ý khi triển khai cơ sở dữ liệu

### 1. Tài khoản test (hiện tại có 2 tài khoản cho mỗi vai trò):
- **Username**: Viết thường toàn bộ + số thứ tự từ 00:
  - Ví dụ: `user00`, `user01` cho vai trò người dùng, `admin00`, `admin01` cho vai trò admin, v.v.
- **Password**: Chữ cái đầu viết hoa, còn lại viết thường + `@123`:
  - Ví dụ: `Admin@123`, v.v. (Lưu trong database là chuỗi bcrypt 12 byte).
- **Role**: Lưu trong database viết hoa toàn bộ.
  - Ví dụ: `ADMIN`, v.v.

### 2. Sử dụng BFS (Breadth-First Search) để tính số comment con:
- Khi có một comment có phản hồi (comment con), sử dụng thuật toán BFS để duyệt tất cả các comment con của comment đó.
- Lưu kết quả vào trường `descendantCommentsCount` trong mỗi comment.
- **Lưu ý**: Cập nhật lại số lượng comment con mỗi khi có sự thay đổi (thêm hoặc xóa comment).

### 3. Tính số comment của bài viết:
- Tổng số comment của bài viết = số comment trực tiếp + số comment con (tính đệ quy).
- Cập nhật lại trường `totalCommentsCount` trong collection **Posts**.
- **Lưu ý**: Mỗi khi có sự thay đổi về comment (thêm, sửa, xóa), cần cập nhật lại số comment tổng của bài viết.

### 4. Cập nhật và duy trì mối quan hệ giữa các collection:
- Đảm bảo các quan hệ giữa các collection (Posts, Comments, Users, Categories, Tags) được duy trì đồng bộ khi thực hiện các thao tác CRUD.
- Khi xóa một bài viết, xóa tất cả bình luận liên quan và cập nhật số liệu tương ứng trong các collection khác.
- Khi thay đổi trạng thái bài viết (ví dụ: từ "pending" sang "published"), cần cập nhật thông báo (notifications) cho người dùng liên quan.

### 5. Quản lý trạng thái bài viết và bình luận:
- Trường `isDeleted` trong collection **Posts** và **Comments** cần được sử dụng để xác định xem một bài viết hoặc bình luận có bị xóa hay không. Tuy nhiên, thay vì xóa vĩnh viễn, có thể chỉ cần đánh dấu là đã xóa để giữ lại dữ liệu lịch sử.
- **Lưu ý**: Đảm bảo rằng mỗi khi cập nhật trường `isDeleted`, các tính toán như số comment phải được cập nhật lại cho chính xác.

### 6. Quản lý thông báo (notifications):
- Mỗi khi có thay đổi về trạng thái bài viết hoặc bình luận (như được upvote, bình luận mới), cần gửi thông báo đến người dùng liên quan.
- Trường `isRead` trong collection **Notifications** nên được cập nhật mỗi khi người dùng xem thông báo, để theo dõi trạng thái đọc của thông báo.

### 7. Quản lý quyền truy cập và vai trò:
- Đảm bảo rằng các quyền truy cập của từng vai trò (Admin, Manager, User) được kiểm soát chặt chẽ, ví dụ:
  - **Admin**: Có quyền duyệt bài, xóa bài, xem và quản lý thông báo.
  - **Manager**: Có quyền duyệt bài và quản lý bài viết nhưng không có quyền quản lý người dùng.
  - **User**: Có quyền viết bài, bình luận, upvote, downvote nhưng không thể duyệt bài hoặc quản lý thông báo của người khác.
- Đảm bảo kiểm tra và áp dụng các quyền truy cập mỗi khi thực hiện các thao tác CRUD.

### 8. Cập nhật mối quan hệ giữa các collection khi thay đổi dữ liệu:
- Khi thay đổi bất kỳ thông tin nào trong các collection (ví dụ: sửa bài viết, thêm bình luận), nhớ cập nhật các liên kết giữa các collection, ví dụ: cập nhật số lượng comment trong bài viết khi có bình luận mới, hoặc cập nhật thông tin người dùng khi thay đổi tài khoản.

### 9. Cải thiện hiệu suất khi truy vấn:
- Các truy vấn như tính toán số comment con và tổng số comment có thể tiêu tốn tài nguyên nếu không được tối ưu. Hãy cân nhắc việc sử dụng các cơ chế cache hoặc chỉ lưu trữ tổng số và số lượng comment con trong mỗi document để giảm tải truy vấn khi cần tính toán.
