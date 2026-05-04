import express from "express";
import cors from "cors";
import surahRoutes from "./routes/surah";
import searchRoutes from "./routes/search";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("api/surah", surahRoutes);
app.use("api/search", searchRoutes);

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
