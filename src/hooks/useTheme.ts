import { useEffect, useState } from 'react';
import { settingsRepository } from '../db/repositories/settings.repository';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const settings = await settingsRepository.get();
      if (settings) {
        setTheme(settings.theme);
        setIsPro(settings.isPro);

        if (settings.theme === 'dark' && settings.isPro) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const settings = await settingsRepository.get();
    if (!settings?.isPro) {
      return;
    }

    const newTheme = theme === 'light' ? 'dark' : 'light';
    await settingsRepository.update({ theme: newTheme });
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { theme, toggleTheme, isPro };
}
