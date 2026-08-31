export interface AppColors {
    background: {
        gradient:
            | string
            | (string | number)[]
            | { colors: string[]; locations?: number[] };
        login: string;
    };
    txt: Record<string, string>;
    error: string;
    secondary: string;
    main: string;
    contrast: string;
    edplogo: {
        c1: string;
        c2: string;
    };
    edptext: string[];
}

export interface AppThemeConfig {
    isDark: boolean;
    colors: AppColors;
    fonts: {
        bold: { fontFamily: string; fontWeight: string };
        heavy: { fontFamily: string; fontWeight: string };
        medium: { fontFamily: string; fontWeight: string };
        regular: { fontFamily: string; fontWeight: string };
    };
    shadow: {
        oppacity: number;
        color?: string;
    };
}
