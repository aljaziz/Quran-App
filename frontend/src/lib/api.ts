import axios from "axios";
import { Surah, SearchResult } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAllSurahs = async (): Promise<Surah[]> => {
    const res = await axios.get(`${API_BASE}/surah`);
    return res.data.data;
};

export const getSurah = async (number: number): Promise<Surah> => {
    const res = await axios.get(`${API_BASE}/surah/${number}`);
    return res.data.data;
};

export const searchAyahs = async (query: string): Promise<SearchResult[]> => {
    const res = await axios.get(
        `${API_BASE}/search?q=${encodeURIComponent(query)}`,
    );
    return res.data.data;
};
