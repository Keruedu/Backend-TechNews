// Hãy kiểm tra lại database xem migration này đã được thực hiện hay chưa.

module.exports = {
  async up(db, client) {
    // 1. Tạo collections và indexes
    await db.createCollection('accounts');
    await db.createCollection('categories');
    await db.createCollection('tags');
    await db.createCollection('posts');

    // Tạo indexes
    await db.collection('accounts').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true }
    ]);

    await db.collection('categories').createIndex(
      { slug: 1 }, { unique: true }
    );

    await db.collection('tags').createIndex(
      { slug: 1 }, { unique: true }
    );

    await db.collection('posts').createIndexes([
      { key: { authorId: 1 } },
      { key: { categoryId: 1 } },
      { key: { tagsId: 1 } },
      { key: { createdAt: -1 } }
    ]);

    // 2. Insert accounts (2 tài khoản mỗi vai trò)
    const accounts = [
      {
        username: "user00",
        email: "user00@technews.com",
        passwordHash: "$2a$12$UdjePFYx.IEHZYAnaB8ZFOFq47x5zY1e96OjbhZQIxrNwljOd2NFy",
        role: "USER",
        createdAt: new Date("2024-12-17"),
        updatedAt: new Date("2024-12-18"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "User A",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662967/U_fqm7po.jpg",
          bio: "Tài khoản user thứ nhất"
        },
        isBanned: false
      },
      {
        username: "user01", 
        email: "user01@technews.com",
        passwordHash: "$2a$12$UdjePFYx.IEHZYAnaB8ZFOFq47x5zY1e96OjbhZQIxrNwljOd2NFy",
        role: "USER",
        createdAt: new Date("2024-12-16"),
        updatedAt: new Date("2024-12-17"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "User B",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734689395/U_1_pew02s.jpg",
          bio: "Tài khoản user thứ hai"
        },
        isBanned: false
      },
      {
        username: "manager00",
        email: "manager00@technews.com", 
        passwordHash: "$2a$12$gAVHRMPccFvtlqPh5UovguN1gSQwxp9p/3abZj92Q/Hs3aV/6BapK",
        role: "MANAGER",
        createdAt: new Date("2024-12-16"),
        updatedAt: new Date("2024-12-18"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "Manager A",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/M_rnwmio.jpg",
          bio: "Tài khoản manager thứ nhất"
        },
        isBanned: false
      },
      {
        username: "manager01",
        email: "manager01@technews.com", 
        passwordHash: "$2a$12$gAVHRMPccFvtlqPh5UovguN1gSQwxp9p/3abZj92Q/Hs3aV/6BapK",
        role: "MANAGER",
        createdAt: new Date("2024-12-18"),
        updatedAt: new Date("2024-12-19"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "Manager B",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734689397/M_1_pmbvyb.jpg",
          bio: "Tài khoản manager thứ hai"
        },
        isBanned: false
      },
      {
        username: "admin00",
        email: "admin00@technews.com",
        passwordHash: "$2a$12$.5Rk9DxD/xjfKMD/woy8HeTQ0nd90qSn8ifoGFhdxTzqt/lZxtkda",
        role: "ADMIN",
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2024-12-16"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "Adminstrator A",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662967/A_urit4f.jpg",
          bio: "Tài khoản adminstrator thứ nhất"
        },
        isBanned: false
      },
      {
        username: "admin01",
        email: "admin01@technews.com",
        passwordHash: "$2a$12$.5Rk9DxD/xjfKMD/woy8HeTQ0nd90qSn8ifoGFhdxTzqt/lZxtkda",
        role: "ADMIN",
        createdAt: new Date("2024-12-14"),
        updatedAt: new Date("2024-12-15"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "Adminstrator B",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734689396/A_1_f2ds3l.jpg",
          bio: "Tài khoản adminstrator thứ hai"
        },
        isBanned: false
      }
    ];

    // 3. Insert categories (10 categories)
    const categories = [
      {
        name: "Software Development",
        slug: "software-development",
        isActive: true
      },
      {
        name: "Web Development",
        slug: "web-development",
        isActive: true
      },
      {
        name: "Mobile Development",
        slug: "mobile-development",
        isActive: true
      },
      {
        name: "Artificial Intelligence and Machine Learning",
        slug: "artificial-intelligence-and-machine-learning",
        isActive: true
      },
      {
        name: "Cloud Computing",
        slug: "cloud-computing",
        isActive: true
      },
      {
        name: "DevOps",
        slug: "devops",
        isActive: true
      },
      {
        name: "Cybersecurity",
        slug: "cybersecurity",
        isActive: true
      },
      {
        name: "Blockchain",
        slug: "blockchain",
        isActive: true
      },
      {
        name: "Cryptocurrency",
        slug: "cryptocurrency",
        isActive: true
      },
      {
        name: "Programming Languages",
        slug: "programming-languages",
        isActive: true
      },
    ];

    // 4. Insert tags (20 tags)
    const tags = [
      {
        name: "JavaScript",
        slug: "javascript",
        isActive: true
      },
      {
        name: "React",
        slug: "react",
        isActive: true
      },
      {
        name: "Node.js",
        slug: "nodejs",
        isActive: true
      },
      {
        name: "Python",
        slug: "python",
        isActive: true
      },
      {
        name: "Django",
        slug: "django",
        isActive: true
      },
      {
        name: "AI",
        slug: "ai",
        isActive: true
      },
      {
        name: "Machine Learning",
        slug: "machine-learning",
        isActive: true
      },
      {
        name: "Data Science",
        slug: "data-science",
        isActive: true
      },
      {
        name: "Cloud",
        slug: "cloud",
        isActive: true
      },
      {
        name: "AWS",
        slug: "aws",
        isActive: true
      },
      {
        name: "Azure",
        slug: "azure",
        isActive: true
      },
      {
        name: "Docker",
        slug: "docker",
        isActive: true
      },
      {
        name: "Kubernetes",
        slug: "kubernetes",
        isActive: true
      },
      {
        name: "WebAssembly",
        slug: "webassembly",
        isActive: true
      },
      {
        name: "GraphQL",
        slug: "graphql",
        isActive: true
      },
      {
        name: "Next.js",
        slug: "nextjs",
        isActive: true
      },
      {
        name: "TypeScript",
        slug: "typescript",
        isActive: true
      },
      {
        name: "Vue.js",
        slug: "vuejs",
        isActive: true
      },
      {
        name: "Angular",
        slug: "angular",
        isActive: true
      }, 
      {
        name: "Git and GitHub",
        slug: "git-and-github",
        isActive: true
      },
    ];

    // 5. Insert dữ liệu và lưu IDs
    const insertedAccounts = await db.collection('accounts').insertMany(accounts);
    const insertedCategories = await db.collection('categories').insertMany(categories);
    const insertedTags = await db.collection('tags').insertMany(tags);

    // 6. Insert posts (10 posts)
    const posts = [
      // Test post 1: User viết, 1 hình ảnh, 1 tag, được duyệt.
      {
        title: "User00 - Giới thiệu về JavaScript ES2024",
        content: `
          <h1>User00 - JavaScript ES2024</h1>
          <p>Các tính năng mới trong phiên bản ES2024...</p>
          <img src="https://res.cloudinary.com/dtjb7bepr/image/upload/v1734745248/JavaScript-ES2024_a3dlus.jpg" alt="JavaScript ES2024">
          <p>Các tính năng mới trong phiên bản ES2024...</p>
        `,
        authorId: insertedAccounts.insertedIds[0], // user00 viết
        categoryId: insertedCategories.insertedIds[1], // category Lập trình web
        tagsId: [insertedTags.insertedIds[0]], // tag JavaScript
        createdAt: new Date(2024-12-17),
        updatedAt: new Date(2024-12-18),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false
      },

      // Test post 2: User viết, 0 hình ảnh, 1 tag, bị từ chối.
      {
        title: "User01 - Giới thiệu về JavaScript ES2024",
        content: `
          <h1>User01 - JavaScript ES2024</h1>
          <p>Các tính năng mới trong phiên bản...</p>
        `,
        authorId: insertedAccounts.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0]], // tag JavaScript
        createdAt: new Date(2024-12-17),
        updatedAt: new Date(2024-12-17),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false
      },

      // Test post 3: User viết, 1 hình ảnh, 2 tag, đang chờ duyệt.
      {
        title: "User00 - Hướng dẫn sử dụng MongoDB",
        content: `
          <h1>User00 - Cách sử dụng MongoDB</h1>
          <p>MongoDB là một cơ sở dữ liệu NoSQL phổ biến.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/MongoDB_fppgfr.jpg' alt='MongoDB' />
          <p>Bạn có thể dễ dàng tạo và quản lý các bản ghi dữ liệu.</p>
        `,
        authorId: insertedAccounts.insertedIds[0], // user00 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0], insertedTags.insertedIds[2]], // tag JavaScript và Node.js
        createdAt: new Date(2024-12-17),
        updatedAt: new Date(2024-12-17),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "PENDING",
        isDeleted: false
      },

      // Test post 4: Manager viết, 1 hình ảnh, 2 tag, được duyệt.
      {
        title: "Manager00 - Cách sử dụng MongoDB",
        content: `
          <h1>Manager00 - Cách sử dụng MongoDB</h1>
          <p>MongoDB là một cơ sở dữ liệu NoSQL phổ biến.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/MongoDB_fppgfr.jpg' alt='MongoDB' />
          <p>Bạn có thể dễ dàng tạo và quản lý các bản ghi dữ liệu.</p>
        `,
        authorId: insertedAccounts.insertedIds[2], // manager00 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0], insertedTags.insertedIds[2]], // tag JavaScript và Node.js
        createdAt: new Date(2024-12-17),
        updatedAt: new Date(2024-12-17),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false
      },

      // Test post 5: Admin viết, 1 hình ảnh, 2 tag, đang chờ duyệt.
      {
        title: "Admin00 - Cách sử dụng MongoDB",
        content: `
          <h1>Admin00 - Cách sử dụng MongoDB</h1>
          <p>MongoDB là một cơ sở dữ liệu NoSQL phổ biến.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/MongoDB_fppgfr.jpg' alt='MongoDB' />
          <p>Bạn có thể dễ dàng tạo và quản lý các bản ghi dữ liệu.</p>
        `,
        authorId: insertedAccounts.insertedIds[4], // admin00 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0], insertedTags.insertedIds[2]], // tag JavaScript và Node.js
        createdAt: new Date(2024-12-16),
        updatedAt: new Date(2024-12-18),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "PENDING",
        isDeleted: false
      },

      // Test post 6: Manager viết, 0 hình ảnh, 1 tag, bị từ chối.
      {
        title: "Manager01 - Tổng quan về AI và Machine Learning",
        content: `
          <h1>Manager01 - AI và Machine Learning</h1>
        `,
        authorId: insertedAccounts.insertedIds[3], // manager01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3]], // tag Python
        createdAt: new Date(2024-12-19),
        updatedAt: new Date(2024-12-20),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false
      },

      // Test post 7: Manager viết, 1 hình ảnh, 1 tag, được duyệt.
      {
        title: "Manager00 - AI và Machine Learning",
        content: `
          <h1>Manager00 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        authorId: insertedAccounts.insertedIds[2], // manager00 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3]], // tag Python
        createdAt: new Date(2024-12-19),
        updatedAt: new Date(2024-12-20),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false
      },

      // Test post 8: Admin viết, 1 hình ảnh, 2 tag, được duyệt.
      {
        title: "Admin01 - AI và Machine Learning",
        content: `
          <h1>Admin01 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
 
        authorId: insertedAccounts.insertedIds[5], // admin01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3], insertedTags.insertedIds[5]], // tag Python và AI
        createdAt: new Date(2024-12-19),
        updatedAt: new Date(2024-12-20),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false
      },

      // Test post 9: User00 viết, 1 hình ảnh, 3 tag, đang chờ duyệt.
      {
        title: "User00 - AI và Machine Learning",
        content: `
          <h1>User00 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        authorId: insertedAccounts.insertedIds[0], // user00 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3], insertedTags.insertedIds[5], insertedTags.insertedIds[6]], // tag Python, AI và Machine Learning
        createdAt: new Date(2024-12-19),
        updatedAt: new Date(2024-12-20),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "PENDING",
        isDeleted: false
      },

      // Test post 10: User01 viết, 1 hình ảnh, 0 tag, bị từ chối.
      {
        title: "User01 - AI và Machine Learning",
        content: `
          <h1>User01 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        authorId: insertedAccounts.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [], // tag 
        createdAt: new Date(2024-12-19),
        updatedAt: new Date(2024-12-20),
        upvotesCount: 10,
        downvotesCount: 2,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false
      },

/*
      // Test post : 
      {
        title: "",
        content: `
          
        `,
        authorId: insertedAccounts.insertedIds[], //  viết
        categoryId: insertedCategories.insertedIds[], // category 
        tagsId: [insertedTags.insertedIds[]], // tag 
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotesCount: ,
        downvotesCount: ,
        commentsId: [],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "",
        isDeleted: false
      },
*/

    ];

    await db.collection('posts').insertMany(posts);
  },

  async down(db, client) {
    // Xóa toàn bộ dữ liệu
    await db.collection('posts').drop();
    await db.collection('tags').drop();
    await db.collection('categories').drop();
    await db.collection('accounts').drop();
  }
};
