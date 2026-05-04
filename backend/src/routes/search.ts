import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const QURAN_API = "https://api.alquran.cloud/v1";
const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

// GET /api/search?q=keyword
router.get("/", async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query || query.trim().length < 2) {
        return res
            .status(400)
            .json({ success: false, message: "Query too short" });
    }
    try {
        // Search in English translation
        const [enRes, arRes] = await Promise.all([
            axios.get(
                `${QURAN_API}/search/${encodeURIComponent(query)}/all/en.sahih`,
            ),
            axios
                .get(`${QURAN_API}/search/${encodeURIComponent(query)}/all/ar`)
                .catch(() => ({ data: { data: { matches: [] } } })),
        ]);

        const enMatches = enRes.data.data?.matches ?? [];
        const arMatches = arRes.data.data?.matches ?? [];

        // Merge and deduplicate by ayah number
        const seen = new Set<number>();
        const merged = [...enMatches, ...arMatches]
            .filter((m: { number: number }) => {
                if (seen.has(m.number)) return false;
                seen.add(m.number);
                return true;
            })
            .slice(0, 50)
            .map(
                (m: {
                    number: number;
                    numberInSurah: number;
                    text: string;
                    surah: {
                        number: number;
                        name: string;
                        englishName: string;
                    };
                    juz: number;
                }) => ({
                    number: m.number,
                    numberInSurah: m.numberInSurah,
                    text: m.text,
                    surah: {
                        number: m.surah.number,
                        name: m.surah.name,
                        englishName: m.surah.englishName,
                    },
                    audio: `${AUDIO_CDN}/${m.number}.mp3`,
                    juz: m.juz,
                }),
            );

        res.json({ success: true, count: merged.length, data: merged });
    } catch (error) {
        res.status(500).json({ success: false, message: "Search failed" });
    }
});

export default router;
