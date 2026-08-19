export function hslToRgb(h, s, l) {
    h = h % 360;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

export function rgbToHsl(r, g, b) {
    let h, s, l;

    r /= 255;
    g /= 255;
    b /= 255;

    let cmax = Math.max(r, g, b);
    let cmin = Math.min(r, g, b);
    let delta = cmax - cmin;

    l = (cmax + cmin) / 2;

    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    switch (cmax) {
        case r:
            h = 60 * (((g - b) / delta) % 6);
            break;
        case g:
            h = 60 * ((b - r) / delta + 2);
            break;
        case b:
            h = 60 * ((r - g) / delta + 4);
            break;
    }

    if (h < 0) h += 360;

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
export const cssRgbToRgb = (text) => {
    if (!text) return [0, 0, 0];
    let match = text.match(/\d+/g);
    if (!match) return [0, 0, 0];
    let [x, y, z] = match;
    return [x, y, z];
};

export const cssRgbToHsl = (text) => {
    const [r, g, b] = cssRgbToRgb(text);

    const [h, s, l] = rgbToHsl(r, g, b);
    return [h, s, l];
};

export const cssHslaToHsla = (text) => {
    if (!text) return [0, 0, 0, 0];
    const values = text.match(/[\d.]+%?/g);

    if (!values || values.length < 4) {
        return [0, 0, 0, 0];
    }

    const [h, s, l, a] = values.map((v, i) =>
        v.includes("%") ? parseFloat(v) : parseFloat(v)
    );

    return [h, s, l, a];
};

export const isDarkColor = (hsl) => {
    if (!hsl) return false;
    const match = hsl.match(/,\s*(\d+)%\)$/);
    if (!match) return false;
    const lightness = parseFloat(match[1]);
    return lightness < 50;
};

export const addOpacityToCssRgb = (text, a) => {
    if (a > 1) return "rgb(255, 100, 20)";

    const [r, g, b] = cssRgbToRgb(text);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const addOpacity = addOpacityToCssRgb;

export const adjustLightness = (hslString, amount) => {
    if (!hslString) return "hsl(0, 0%, 50%)";
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) {
        return hslString; // Return original if not HSL
    }

    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);

    const newL = Math.max(0, Math.min(100, l + amount));

    return `hsl(${h}, ${s}%, ${newL}%)`;
};

export const adjustSaturation = (hslString, amount) => {
    if (!hslString) return "hsl(0, 0%, 50%)";
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) {
        return hslString;
    }

    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);

    const newS = Math.max(0, Math.min(100, s + amount));

    return `hsl(${h}, ${newS}%, ${l}%)`;
};

export const blendWithWhite = (hslColor, opacity = 0.35) => {
    const match = hslColor.match(
        /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i
    );

    if (!match) return hslColor;

    const [, h, s, l] = match.map(Number);
    const [r, g, b] = hslToRgb(h, s / 100, l / 100);

    const blendedR = Math.round(r * opacity + 255 * (1 - opacity));
    const blendedG = Math.round(g * opacity + 255 * (1 - opacity));
    const blendedB = Math.round(b * opacity + 255 * (1 - opacity));

    return `rgb(${blendedR}, ${blendedG}, ${blendedB})`;
};

