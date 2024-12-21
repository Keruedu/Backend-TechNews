import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import path from 'path';
import postRoutes from './src/routes/posts.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

app.use(express.json());    // allows us to accept JSON data in the req.body

app.use("/api/posts", postRoutes);

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


