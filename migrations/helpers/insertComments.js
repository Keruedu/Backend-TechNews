export default async function insertComments(db, users, posts) {
    const comments = [
        {
          content: 'This is a comment on post 1',
          authorId: users.insertedIds[0],
          postId: posts.insertedIds[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'This is another comment on post 1',
          authorId: users.insertedIds[1],
          postId: posts.insertedIds[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'This is a comment on post 2',
          authorId: users.insertedIds[2],
          postId: posts.insertedIds[1],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
  
    return await db.collection('comments').insertMany(comments);
    
  };