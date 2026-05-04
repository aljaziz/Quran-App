import axios from "axios";
import { Response, Request, Router } from "express";
import { ApiSurahResponse, Surah } from "../types";

const router = Router();

const QURAN_API = "https://api.alquran.cloud/v1";
const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

// GET /api/surah — list all 114 surahs
router.get("/", async (req: Request, res: Response) => {
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

router.get("/:number", async (req: Request, res: Response) => {
    const { number } = req.params;
    try {
        const [arabicRes, translationsRes] = await Promise.all([
            axios.get<ApiSurahResponse>(`${QURAN_API}/surah/${number}`),
            axios.get<ApiSurahResponse>(
                `${QURAN_API}/surah/${number}/en.sahih`,
            ),
        ]);

        const arabicData = arabicRes.data.data;
        const translationData = translationsRes.data.data;

        const ayahs = arabicData.ayahs.map((ayah, index) => ({
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text: ayah.text,
            translation: translationData.ayahs[index]?.text ?? "",
            audio: `${AUDIO_CDN}/${ayah.number}.mp3`,
            juz: ayah.juz,
            page: ayah.page,
        }));

        const surah: Surah & { ayahs: typeof ayahs } = {
            number: arabicData.number,
            name: arabicData.name,
            englishName: arabicData.englishName,
            englishNameTranslation: arabicData.englishNameTranslation,
            numberOfAyahs: arabicData.numberOfAyahs,
            revelationType: arabicData.revelationType,
            ayahs,
        };

        res.json({ success: true, data: surah });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch surah",
        });
    }
});

export default router;
