export const summarizeDocument = async (content: string) => {
  const url = 'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize';

  const headers = {
    'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_OPEN_API_CLIENT_ID!,
    'X-NCP-APIGW-API-KEY': process.env.NAVER_OPEN_API_CLIENT_SECRET!,
    'Content-Type': 'application/json'
  };

  const body = {
    document: { content },
    option: {
      language: 'ko',
      model: 'general',
      /**
       * 정충체 : 해요체로 바꾸고 싶으면 1로 변경
       */
      tone: 2,
      /**
       * 요약 문장 개수
       */
      summaryCount: 3,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return ((await response.json()) as { summary: string }).summary;
};
