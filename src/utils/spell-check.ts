import hanspell, { type HanspellPnuResult } from 'hanspell';

export const spellCheck = async (sentence: string) => {
  const pnuResults = await new Promise<HanspellPnuResult[]>((resolve, reject) => {
    const pnuResponse: HanspellPnuResult[] = [];
    hanspell.spellCheckByPNU(
      sentence,
      6000,
      (result) => pnuResponse.push(result),
      () => {
        resolve(pnuResponse);
      },
      reject,
    );
  });

  return pnuResults;
};
