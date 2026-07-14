'use client';

import React from 'react';
import { useLanguage } from '@/context/language-provider';
import get from 'lodash/get';

export function useTranslation() {
  const { translations, language } = useLanguage();

  const t = React.useCallback(
    (key: string, defaultValue?: string): string => {
      return get(translations, key, defaultValue ?? key);
    },
    [translations]
  );

  return { t, language };
}
