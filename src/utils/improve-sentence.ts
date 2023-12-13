// eslint-disable-next-line import/no-unresolved
import { ChatGPTAPI } from 'chatgpt';

const chatGptApi = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY!,
  completionParams: {
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    top_p: 0.8,
  }
});

export const improveSentence = async (question: string, personalStatement: string) => {
  const response = await chatGptApi.sendMessage(
    `질문: ${question}\n자소서: ${personalStatement}`,
    {
      systemMessage: '입력된 질문을 기반으로 한 입력된 자기소개서에 대하여, 가장 중요한 4개의 문장만 골라, 수정 이유와 각 문장에 대한 개선된 문장을 제공해주십시오.\n질문은 "질문: " 뒤에 입력되고, 자기소개서는 "자소서: " 뒤에 입력됩니다.\n반드시 아래와 같은 형식의 JSON으로 "JSON 외의 부가적인 설명 없이" 답변해주십시오.\n[{"original": "원본 문장", "reason": "수정 이유", "improved": "개선 문장"}, {...}]',
    }
  );

  // keep only the json [{...}, {...}] part
  const json = response.text.slice(response.text.indexOf('['), response.text.indexOf(']') + 1);
  const parsed = JSON.parse(json);
  return parsed as {
    original: string;
    reason: string;
    improved: string;
  }[];
};
  
