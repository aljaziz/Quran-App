export interface Ayah {
    number: number;
    numberInSurah: number;
    text: string;
    translation: string;
    audio: string;
    juz: number;
    page: number;
}

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    ayahs?: Ayah[];
}
