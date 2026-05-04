import axios from "axios";
import { Response, Request, Router } from "express";
import { Surah } from "../types";

const rotuer = Router();

const QURAN_API = "https://api.alquran.cloud/v1";
const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

// GET /api/surah — list all 114 surahs
rotuer.get("/", async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${QURAN_API}/surah`);
        const surahs: Surah[] = response.data.data.map((s: Surah) => ({
            number: s.number,
            name: s.name,
            englishName: s.englishName,
            englishNameTranslation: s.englishNameTranslation,
            numberOfAyahs: s.numberOfAyahs,
            revelationType: s.revelationType,
        }));
        res.json({ success: true, data: surahs });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch surahs",
        });
    }
});
