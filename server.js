import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import path from 'path';
import cors from 'cors';
import postRoutes from './src/routes/posts.js';
import authRoutes from './src/routes/auth.js';
import categoryRoutes from './src/routes/categories.js';
import tagRoutes from './src/routes/tags.js';
import commentRoutes from './src/routes/comments.js';
import userRoutes from './src/routes/users.js';


dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();


app.use(cors());
app.use(express.json());    // allows us to accept JSON data in the req.body

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));
//     app.get("*", (req, res)=> {
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     })
// }

app.listen(PORT, () => {
    connectDB();
    console.log('Server running on http://localhost:' + PORT);
});