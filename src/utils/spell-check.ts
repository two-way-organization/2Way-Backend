import hanspell, { type HanspellDaumResult, type HanspellPnuResult, HanspellResult } from 'hanspell';

export const spellCheck = async (sentence: string) => {
  const daumResults = await new Promise<HanspellDaumResult[]>((resolve, reject) => {
    const daumResponse: HanspellDaumResult[] = [];
    hanspell.spellCheckByDAUM(
      sentence,
      6000,
      (result) => daumResponse.push(result),
      () => {
        resolve(daumResponse);
      },
      reject,
    );
  });

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

  return (daumResults as HanspellResult[]).concat(pnuResults);
};
