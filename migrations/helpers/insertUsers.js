export default async function insertAccounts(db) {
    const users = [
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
          username: "vietle",
          email: "vietle@gmail.com",
          passwordHash: "$2b$10$1dIqV3LFEkYJ7dxwNRY83ukrb92SPCRWi6.Ec4816M.tgevefFjl.",
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
        },
      ];
  
    return await db.collection('users').insertMany(users);
    
  };