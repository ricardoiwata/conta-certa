// src/theme/adapters/paper.ts
import type { ColorTokens } from '@/theme/scheme';
import type { MD3Theme } from 'react-native-paper';
import { configureFonts } from 'react-native-paper';

// opcional: defina sua família de fontes
const fontConfig = {
    // MD3 pede weight: '400' | '500' | '700' etc
    // Aqui mapeamos para a fonte padrão do sistema ou a sua (ex.: 'SpaceMono')
    displayLarge: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 57, lineHeight: 64 },
    headlineLarge: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 32, lineHeight: 40 },
    titleLarge: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 22, lineHeight: 28 },
    bodyLarge: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 16, lineHeight: 24 },
    labelLarge: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 14, lineHeight: 20 },
};

// converte seus tokens → MD3Theme do Paper
export function makePaperTheme(mode: 'light' | 'dark', c: ColorTokens): MD3Theme {
    // MD3 exige um conjunto de chaves; usamos seus tokens para preencher
    const colors = {
        primary: c.primary,
        onPrimary: c.textOnPrimary,
        background: c.background,
        surface: c.surface,
        surfaceVariant: c.surfaceAlt,
        onSurface: c.text,
        onBackground: c.text,
        outline: c.border,
        error: c.error,
        onError: c.textOnPrimary,
        // extras úteis
        secondary: c.primaryContainer,
        onSecondary: c.text,
        inverseSurface: c.background,
        inverseOnSurface: c.text,
        // compat
        elevation: { level0: 'transparent', level1: c.surface, level2: c.surfaceAlt, level3: c.surfaceAlt, level4: c.surfaceAlt, level5: c.surfaceAlt } as any,
    } as MD3Theme['colors'];

    return {
        version: 3,
        isV3: true,
        dark: mode === 'dark',
        mode: 'exact',
        roundness: 10,
        colors,
        fonts: configureFonts({ config: fontConfig }),
        animation: { scale: 1.0 },
    };
}
