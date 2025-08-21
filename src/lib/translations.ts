// Direct translation imports to avoid webpack module loading issues
import nlCommon from '../../locales/nl/common.json';
import esCommon from '../../locales/es/common.json';
import enCommon from '../../locales/en/common.json';
import deCommon from '../../locales/de/common.json';

import nlChat from '../../locales/nl/chat.json';
import esChat from '../../locales/es/chat.json';
import enChat from '../../locales/en/chat.json';
import deChat from '../../locales/de/chat.json';

export const translations = {
  nl: { ...nlCommon, chat: nlChat },
  es: { ...esCommon, chat: esChat },
  en: { ...enCommon, chat: enChat },
  de: { ...deCommon, chat: deChat }
} as const;

export type SupportedLocale = keyof typeof translations;
