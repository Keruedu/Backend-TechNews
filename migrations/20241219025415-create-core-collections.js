import createCollections from './helpers/createCollections.js';
import insertUsers from './helpers/insertUsers.js';
import insertCategories from './helpers/insertCategories.js';
import insertTags from './helpers/insertTags.js';
import insertPosts from './helpers/insertPosts.js';
import insertComments from './helpers/insertComments.js';

export const up = async (db, client) => {
  await createCollections(db);

  const insertedUsers = await insertUsers(db);
  console.log(`${insertedUsers.insertedCount} users have been inserted into the database.`);
  
  const insertedCategories = await insertCategories(db);
  console.log(`${insertedCategories.insertedCount} categories have been inserted into the database.`);
  
  const insertedTags = await insertTags(db);
  console.log(`${insertedTags.insertedCount} tags have been inserted into the database.`);
  
  const insertedPosts = await insertPosts(db, insertedUsers, insertedCategories, insertedTags);
  console.log(`${insertedPosts.insertedCount} posts have been inserted into the database.`);

  const insertedComments = await insertComments(db, insertedUsers, insertedPosts);
  console.log(`${insertedComments.insertedCount} comments have been inserted into the database.`);
};

export const down = async (db, client) => {
  await db.collection('comments').deleteMany({});
  await db.collection('comments').drop();

  await db.collection('posts').deleteMany({});
  await db.collection('posts').drop();
  
  await db.collection('tags').deleteMany({});
  await db.collection('tags').drop();
  
  await db.collection('categories').deleteMany({});
  await db.collection('categories').drop();
  
  await db.collection('users').deleteMany({});
  await db.collection('users').drop();
};