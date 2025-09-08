import { brand, feedback, neutrals } from './palette';

export type ColorTokens = {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    shadow: string;

    text: string;
    textMuted: string;
    textOnPrimary: string;

    primary: string;
    primaryContainer: string;

    error: string;
    warning: string;
    success: string;

    overlay: string;
    pressOpacity: number;
    disabledOpacity: number;
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

    primary: brand.primary_200,
    primaryContainer: brand.primary_600,

    error: feedback.error_300,
    warning: feedback.warning_300,
    success: feedback.success_300,

    overlay: '#00000099',
    pressOpacity: 0.08,
    disabledOpacity: 0.55,
};
