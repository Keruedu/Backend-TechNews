export default async function createCollections(db) {
  await db.createCollection('accounts');
  await db.createCollection('categories');
  await db.createCollection('tags');
  await db.createCollection('posts');

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
};