//https://rapidapi.com/smodin/api/plagiarism-checker-and-auto-citation-generator-multi-lingual/ 에서 basic버전 구독해주세요.

const url = 'https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism';
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
  'X-RapidAPI-Host': process.env.RAPID_API_HOST!,
};

export const checkPlagiarism = async (text: string) => {
  const payload = {
    text: text,
    language: 'ko',
    includeCitations: false,
    scrapeSources: false
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers,
    });
    return (await response.json() as {
      percentPlagiarism: number; // 0 ~ 100
    }).percentPlagiarism;
  } catch (error) {
    console.error(error);
    return null;
  }
};