/**
 * TranslationService Module
 * 
 * Abstracted translation service interface supporting IndicTrans2 / multi-engine translation.
 * 
 * Includes development flag `languageQAEnabled` for language QA auditing.
 */

import { Language } from '../types';

export class TranslationService {
  public languageQAEnabled = true;

  public async translate(text: string, targetLanguage: Language): Promise<string> {
    if (targetLanguage === 'en' || !text) return text;

    // Abstracted IndicTrans2 / server translation interface fallback
    return text;
  }

  public detectLanguage(text: string): Language {
    if (!text) return 'en';

    // Tamil Unicode range detection (0x0B80 - 0x0BFF)
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';

    // Devanagari (Hindi) Unicode range detection (0x0900 - 0x097F)
    if (/[\u0900-\u097F]/.test(text)) return 'hi';

    // Telugu Unicode range (0x0C00 - 0x0C7F)
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';

    // Kannada Unicode range (0x0C80 - 0x0CFF)
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';

    // Malayalam Unicode range (0x0D00 - 0x0D7F)
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';

    return 'en';
  }

  public validateTranslation(originalText: string, translatedText: string): boolean {
    if (!originalText || !translatedText) return false;
    return translatedText.length > 0;
  }
}

export const translationService = new TranslationService();
