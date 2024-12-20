module.exports = {
  async up(db, client) {
    // 1. Tạo collections và indexes
    await db.createCollection('accounts');
    await db.createCollection('tags');
    await db.createCollection('posts');

    await db.collection('accounts').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true }
    ]);

    await db.collection('tags').createIndex(
      { slug: 1 }, { unique: true }
    );

    await db.collection('posts').createIndexes([
      { key: { authorId: 1 } },
      { key: { tags: 1 } },
      { key: { createdAt: -1 } }
    ]);

    // 2. Insert accounts
    const accounts = [
      {
        username: "user",
        email: "user@technews.com",
        passwordHash: "$2a$12$UdjePFYx.IEHZYAnaB8ZFOFq47x5zY1e96OjbhZQIxrNwljOd2NFy", // Using bcrypt to hash password
        role: "USER",
        createdAt: new Date("2024-12-18"),
        updatedAt: new Date("2024-12-18"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "Normal User",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662967/U_fqm7po.jpg",
          bio: "Normal User of TechNews"
        },
        isBanned: false
      },
      {
        username: "manager",
        email: "manager@technews.com",
        passwordHash: "$2a$12$gAVHRMPccFvtlqPh5UovguN1gSQwxp9p/3abZj92Q/Hs3aV/6BapK", // Using bcrypt to hash password
        role: "MANAGER",
        createdAt: new Date("2024-12-18"),
        updatedAt: new Date("2024-12-18"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "Content Manager",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/M_rnwmio.jpg",
          bio: "Manager of TechNews"
        },
        isBanned: false
      },
      {
        username: "admin",
        email: "admin@technews.com",
        passwordHash: "$2a$12$.5Rk9DxD/xjfKMD/woy8HeTQ0nd90qSn8ifoGFhdxTzqt/lZxtkda", // Using bcrypt to hash password
        role: "ADMIN",
        createdAt: new Date("2024-12-18"),
        updatedAt: new Date("2024-12-18"),
        lastLogin: new Date("2024-12-20"),
        bookmarkedPosts: [],
        upvotedPosts: [],
        downvotedPosts: [],
        profile: {
          name: "System Admin",
          avatar: "https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662967/A_urit4f.jpg",
          bio: "Adminstrator of TechNews"
        },
        isBanned: false
      }
    ];

    // 3. Insert tags
    const tags = [
      {
        name: "Web & Mobile Development",
        slug: "web-mobile-development"
      },
      {
        name: "AI, Data & Machine Learning",
        slug: "ai-data-machine-learning"
      },
      {
        name: "Backend & Databases",
        slug: "backend-databases"
      },
      {
        name: "Blockchain & Cybersecurity",
        slug: "blockchain-cybersecurity"
      },
      {
        name: "Others",
        slug: "others"
      }
    ];

    const insertedAccounts = await db.collection('accounts').insertMany(accounts);
    const insertedTags = await db.collection('tags').insertMany(tags);

    // 4. Insert posts
    const posts = [
      {
        title: "Hướng dẫn sử dụng MongoDB",
        content: `
          <h1>Hướng dẫn sử dụng MongoDB</h1>
          <p>MongoDB là một cơ sở dữ liệu NoSQL phổ biến.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/MongoDB_fppgfr.jpg' alt='MongoDB' />
          <p>Bạn có thể dễ dàng tạo và quản lý các bản ghi dữ liệu.</p>
        `,
        authorId: insertedAccounts.insertedIds[0], // user viết
        tags: ["Backend & Databases"],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        upvotesCount: 25,
        downvotesCount: 3,
        commentsID: [],
        totalCommentsCount: 0,
        bookmarkedByAcoountId: [],
        status: "Approved",
        isDeleted: false
      },
      {
        title: "Tổng quan về AI và Machine Learning",
        content: `
          <h1>AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        authorId: insertedAccounts.insertedIds[1], // manager viết
        tags: ["AI, Data & Machine Learning"],
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
        upvotesCount: 30,
        downvotesCount: 2,
        commentsID: [],
        totalCommentsCount: 0,
        bookmarkedByAcoountId: [],
        status: "Approved",
        isDeleted: false
      }
    ];

    await db.collection('posts').insertMany(posts);
  },

  async down(db, client) {
    await db.collection('accounts').drop();
    await db.collection('tags').drop();
    await db.collection('posts').drop();
  }
};
