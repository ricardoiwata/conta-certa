// src/theme/scheme.ts
import { brand, feedback, neutrals } from './palette';

export type ColorTokens = {
    // fundamentos
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    shadow: string;

    // texto
    text: string;
    textMuted: string;
    textOnPrimary: string;

    // ação
    primary: string;
    primaryContainer: string;

    // feedback
    error: string;
    warning: string;
    success: string;

    // estados/overlays
    overlay: string;          // para modais
    pressOpacity: number;     // 0..1
    disabledOpacity: number;  // 0..1
};

export const lightColors: ColorTokens = {
    background: neutrals.white,
    surface: neutrals.n_050,
    surfaceAlt: neutrals.white,
    border: neutrals.n_150,
    shadow: '#00000022',

    text: '#0C0C0C',
    textMuted: neutrals.n_500,
    textOnPrimary: neutrals.white,

    primary: brand.primary_700,
    primaryContainer: brand.primary_050,

    error: feedback.error_500,
    warning: feedback.warning_500,
    success: feedback.success_500,

    overlay: '#00000066',
    pressOpacity: 0.06,
    disabledOpacity: 0.5,
};

export const darkColors: ColorTokens = {
    background: neutrals.n_950,
    surface: neutrals.n_900,
    surfaceAlt: neutrals.n_800,
    border: neutrals.n_600,
    shadow: '#000000AA',

    text: '#E7F6F0',
    textMuted: neutrals.n_300,
    textOnPrimary: neutrals.n_950,

    // em dark, elevamos o “primary” para manter contraste AA/AAA
    primary: brand.primary_200,
    primaryContainer: brand.primary_600,

    error: feedback.error_300,
    warning: feedback.warning_300,
    success: feedback.success_300,

    overlay: '#00000099',
    pressOpacity: 0.08,
    disabledOpacity: 0.55,
};
