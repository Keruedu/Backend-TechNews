export default async function insertPosts(db, insertedUsers, insertedCategories, insertedTags) {
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[0], // user00 viết
        categoryId: insertedCategories.insertedIds[1], // category Lập trình web
        tagsId: [insertedTags.insertedIds[0]], // tag JavaScript
        createdAt: new Date('2024-12-17'),
        updatedAt: new Date('2024-12-18'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false,
        views: 400
      },

      // Test post 2: User viết, 0 hình ảnh, 1 tag, bị từ chối.
      {
        title: "User01 - Giới thiệu về JavaScript ES2024",
        content: `
          <h1>User01 - JavaScript ES2024</h1>
          <p>Các tính năng mới trong phiên bản...</p>
        `,
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0]], // tag JavaScript
        createdAt: new Date('2024-12-17'),
        updatedAt: new Date('2024-12-17'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 300
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[0], // user00 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0], insertedTags.insertedIds[2]], // tag JavaScript và Node.js
        createdAt: new Date('2024-12-17'),
        updatedAt: new Date('2024-12-17'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "PENDING",
        isDeleted: false,
        views: 10000,
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[2], // manager00 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0], insertedTags.insertedIds[2]], // tag JavaScript và Node.js
        createdAt: new Date('2024-12-17'),
        updatedAt: new Date('2024-12-17'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false,
        views: 10000,
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[4], // admin00 viết
        categoryId: insertedCategories.insertedIds[1], // category Web Development
        tagsId: [insertedTags.insertedIds[0], insertedTags.insertedIds[2]], // tag JavaScript và Node.js
        createdAt: new Date('2024-12-16'),
        updatedAt: new Date('2024-12-18'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "PENDING",
        isDeleted: false,
        views: 1,
      },

      // Test post 6: Manager viết, 0 hình ảnh, 1 tag, bị từ chối.
      {
        title: "Manager01 - Tổng quan về AI và Machine Learning",
        content: `
          <h1>Manager01 - AI và Machine Learning</h1>
        `,
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[3], // manager01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3]], // tag Python
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 100,
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[2], // manager00 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3]], // tag Python
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false,
        views: 1000,
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[5], // admin01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3], insertedTags.insertedIds[5]], // tag Python và AI
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "APPROVED",
        isDeleted: false,
        views: 1000,
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[0], // user00 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [insertedTags.insertedIds[3], insertedTags.insertedIds[5], insertedTags.insertedIds[6]], // tag Python, AI và Machine Learning
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "PENDING",
        isDeleted: false,
        views: 1000,
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
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [], // tag 
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 1000,
      },

      {
        title: "User01 - AI và Machine Learning",
        content: `
          <h1>User01 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [], // tag 
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 1000,
      },

      {
        title: "User01 - AI và Machine Learning",
        content: `
          <h1>User01 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [], // tag 
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 1000,
      },

      {
        title: "User01 - AI và Machine Learning",
        content: `
          <h1>User01 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [], // tag 
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 1000,
      },

      {
        title: "User01 - AI và Machine Learning",
        content: `
          <h1>User01 - AI và Machine Learning</h1>
          <p>Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc.</p>
          <img src='https://res.cloudinary.com/dtjb7bepr/image/upload/v1734662966/AIML_z0svnc.jpg' alt='AI and ML' />
          <p>Khám phá các khái niệm cơ bản và ứng dụng trong thực tế.</p>
        `,
        thumbnail: "https://picsum.photos/200/300/?random&grayscale",
        authorId: insertedUsers.insertedIds[1], // user01 viết
        categoryId: insertedCategories.insertedIds[3], // category Artificial Intelligence and Machine Learning
        tagsId: [], // tag 
        createdAt: new Date('2024-12-19'),
        updatedAt: new Date('2024-12-20'),
        upvotesCount: 2,
        downvotesCount: 1,
        upvotedBy: [insertedUsers.insertedIds[1], insertedUsers.insertedIds[3]],
        downvotedBy: [insertedUsers.insertedIds[0]],
        totalCommentsCount: 0,
        bookmarkedByAccountId: [],
        status: "REJECTED",
        isDeleted: false,
        views: 1000,
      },


    ];
  
    return await db.collection('posts').insertMany(posts);
  };


  