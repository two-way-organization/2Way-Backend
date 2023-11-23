declare module 'hanspell' {
  export interface HanspellResult {
    token: string;
    suggestions: string[];
  }

  export interface HanspellDaumResult extends HanspellResult {
    type: string;
    context: string;
  }

  export interface HanspellPnuResult extends HanspellResult {
    info: string;
  }

  export function spellCheckByDAUM(sentence: string, timeout: number, resolve: (result: HanspellDaumResult) => void, end: () => void, reject: (error: unknown) => void): void;
  export function spellCheckByPNU(sentence: string, timeout: number, resolve: (result: HanspellPnuResult) => void, end: () => void, reject: (error: unknown) => void): void;
}
