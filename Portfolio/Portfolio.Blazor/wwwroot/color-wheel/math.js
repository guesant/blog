export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function normalizeHue(h) {
    return ((h % 360) + 360) % 360;
}

export function hsbToRgb(h, s, b) {
    const hue = normalizeHue(h);
    const sat = clamp(s, 0, 100) / 100;
    const bri = clamp(b, 0, 100) / 100;

    const c = bri * sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = bri - c;

    let rp = 0;
    let gp = 0;
    let bp = 0;

    if (hue < 60) {
        [rp, gp, bp] = [c, x, 0];
    } else if (hue < 120) {
        [rp, gp, bp] = [x, c, 0];
    } else if (hue < 180) {
        [rp, gp, bp] = [0, c, x];
    } else if (hue < 240) {
        [rp, gp, bp] = [0, x, c];
    } else if (hue < 300) {
        [rp, gp, bp] = [x, 0, c];
    } else {
        [rp, gp, bp] = [c, 0, x];
    }

    return {
        r: Math.round((rp + m) * 255),
        g: Math.round((gp + m) * 255),
        b: Math.round((bp + m) * 255),
    };
}

export function rgbToHsb({ r, g, b }) {
    const rp = r / 255;
    const gp = g / 255;
    const bp = b / 255;
    const max = Math.max(rp, gp, bp);
    const min = Math.min(rp, gp, bp);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rp) {
            h = ((gp - bp) / delta) % 6;
        } else if (max === gp) {
            h = (bp - rp) / delta + 2;
        } else {
            h = (rp - gp) / delta + 4;
        }
        h *= 60;
        if (h < 0) {
            h += 360;
        }
    }

    const s = max === 0 ? 0 : delta / max;
    const bri = max;

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        b: Math.round(bri * 100),
    };
}

export function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

export function isValidHex(value) {
    return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function hexToRgb(value) {
    const trimmed = value.trim();
    if (!isValidHex(trimmed)) {
        return null;
    }
    let hex = trimmed.replace("#", "");
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
    }
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    };
}

export function isValidRgbChannel(value) {
    return Number.isInteger(value) && value >= 0 && value <= 255;
}

export function rgbToHsl({ r, g, b }) {
    const rp = r / 255;
    const gp = g / 255;
    const bp = b / 255;
    const max = Math.max(rp, gp, bp);
    const min = Math.min(rp, gp, bp);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rp) {
            h = ((gp - bp) / delta) % 6;
        } else if (max === gp) {
            h = (bp - rp) / delta + 2;
        } else {
            h = (rp - gp) / delta + 4;
        }
        h *= 60;
        if (h < 0) {
            h += 360;
        }
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

export function hslToRgb(h, s, l) {
    const hue = normalizeHue(h);
    const sat = clamp(s, 0, 100) / 100;
    const light = clamp(l, 0, 100) / 100;
    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = light - c / 2;

    let rp = 0;
    let gp = 0;
    let bp = 0;

    if (hue < 60) {
        [rp, gp, bp] = [c, x, 0];
    } else if (hue < 120) {
        [rp, gp, bp] = [x, c, 0];
    } else if (hue < 180) {
        [rp, gp, bp] = [0, c, x];
    } else if (hue < 240) {
        [rp, gp, bp] = [0, x, c];
    } else if (hue < 300) {
        [rp, gp, bp] = [x, 0, c];
    } else {
        [rp, gp, bp] = [c, 0, x];
    }

    return {
        r: Math.round((rp + m) * 255),
        g: Math.round((gp + m) * 255),
        b: Math.round((bp + m) * 255),
    };
}

export function rgbToCmyk({ r, g, b }) {
    const rp = r / 255;
    const gp = g / 255;
    const bp = b / 255;
    const k = 1 - Math.max(rp, gp, bp);

    if (k >= 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = (1 - rp - k) / (1 - k);
    const m = (1 - gp - k) / (1 - k);
    const y = (1 - bp - k) / (1 - k);

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
    };
}

export function cmykToRgb({ c, m, y, k }) {
    const cp = clamp(c, 0, 100) / 100;
    const mp = clamp(m, 0, 100) / 100;
    const yp = clamp(y, 0, 100) / 100;
    const kp = clamp(k, 0, 100) / 100;

    return {
        r: Math.round(255 * (1 - cp) * (1 - kp)),
        g: Math.round(255 * (1 - mp) * (1 - kp)),
        b: Math.round(255 * (1 - yp) * (1 - kp)),
    };
}

function srgbToLinear(channel) {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel) {
    const value =
        channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.max(channel, 0) ** (1 / 2.4) - 0.055;
    return Math.round(clamp(value * 255, 0, 255));
}

function labPivot(value) {
    return value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
}

function labPivotInverse(value) {
    const cube = value ** 3;
    return cube > 0.008856 ? cube : (value - 16 / 116) / 7.787;
}

// CIELAB using the D65 reference white, with sRGB as the interchange space.
export function rgbToLab({ r, g, b }) {
    const red = srgbToLinear(r);
    const green = srgbToLinear(g);
    const blue = srgbToLinear(b);

    const x = labPivot((0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / 0.95047);
    const y = labPivot((0.2126729 * red + 0.7151522 * green + 0.072175 * blue) / 1);
    const z = labPivot((0.0193339 * red + 0.119192 * green + 0.9503041 * blue) / 1.08883);

    return {
        l: Math.round((116 * y - 16) * 10) / 10,
        a: Math.round(500 * (x - y) * 10) / 10,
        b: Math.round(200 * (y - z) * 10) / 10,
    };
}

export function labToRgb({ l, a, b }) {
    const fy = (l + 16) / 116;
    const fx = fy + a / 500;
    const fz = fy - b / 200;

    const x = 0.95047 * labPivotInverse(fx);
    const y = labPivotInverse(fy);
    const z = 1.08883 * labPivotInverse(fz);

    const red = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const green = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
    const blue = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    return {
        r: linearToSrgb(red),
        g: linearToSrgb(green),
        b: linearToSrgb(blue),
    };
}

function channelToLinear(channel) {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }) {
    const rl = channelToLinear(r);
    const gl = channelToLinear(g);
    const bl = channelToLinear(b);
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function contrastRatio(rgbA, rgbB) {
    const lumA = relativeLuminance(rgbA);
    const lumB = relativeLuminance(rgbB);
    const lighter = Math.max(lumA, lumB);
    const darker = Math.min(lumA, lumB);
    return (lighter + 0.05) / (darker + 0.05);
}

export const COLORBLIND_MATRICES = {
    protanopia: [
        [0.567, 0.433, 0],
        [0.558, 0.442, 0],
        [0, 0.242, 0.758],
    ],
    deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7],
    ],
    tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.433, 0.567],
        [0, 0.475, 0.525],
    ],
};

export function simulateColorblindness({ r, g, b }, matrix) {
    return {
        r: clamp(Math.round(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b), 0, 255),
        g: clamp(Math.round(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b), 0, 255),
        b: clamp(Math.round(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b), 0, 255),
    };
}

export const HARMONY_RULES = [
    "analogous",
    "monochromatic",
    "triad",
    "complementary",
    "split-complementary",
    "double-split-complementary",
    "square",
    "compound",
    "shades",
    "custom",
];

const HUE_OFFSETS = {
    analogous: [-30, 0, 30],
    triad: [0, 120, 240],
    complementary: [0, 180],
    "split-complementary": [0, 150, 210],
    "double-split-complementary": [-30, 30, 150, 210],
    square: [0, 90, 180, 270],
    compound: [0, 30, 180, 210],
};

const MONOCHROMATIC_DELTAS = [
    { ds: 0, db: 0 },
    { ds: 0, db: -25 },
    { ds: -30, db: 10 },
    { ds: 20, db: -18 },
    { ds: -18, db: -12 },
];

const SHADE_DELTAS = [0, -18, -36, -54, -70];

export function harmonyHues(rule, baseHue) {
    const offsets = HUE_OFFSETS[rule];
    if (!offsets) {
        return [normalizeHue(baseHue)];
    }
    return offsets.map((offset) => normalizeHue(baseHue + offset));
}

export function buildPalette(rule, base) {
    const offsets = HUE_OFFSETS[rule];

    if (rule === "monochromatic") {
        return MONOCHROMATIC_DELTAS.map(({ ds, db }) => ({
            h: base.h,
            s: clamp(base.s + ds, 0, 100),
            b: clamp(base.b + db, 5, 100),
            kind: "primary",
            offset: 0,
            sDelta: ds,
        }));
    }

    if (rule === "shades") {
        return SHADE_DELTAS.map((db) => ({
            h: base.h,
            s: base.s,
            b: clamp(base.b + db, 5, 100),
            kind: "primary",
            offset: 0,
            sDelta: 0,
        }));
    }

    if (!offsets) {
        return [
            {
                h: normalizeHue(base.h),
                s: base.s,
                b: base.b,
                kind: "primary",
                offset: 0,
                sDelta: 0,
            },
            {
                h: normalizeHue(base.h + 90),
                s: base.s,
                b: base.b,
                kind: "primary",
                offset: 90,
                sDelta: 0,
            },
            {
                h: normalizeHue(base.h + 180),
                s: base.s,
                b: base.b,
                kind: "primary",
                offset: 180,
                sDelta: 0,
            },
            {
                h: normalizeHue(base.h + 270),
                s: base.s,
                b: base.b,
                kind: "primary",
                offset: 270,
                sDelta: 0,
            },
        ];
    }

    const primaries = offsets.map((offset) => ({
        h: normalizeHue(base.h + offset),
        s: base.s,
        b: base.b,
        kind: "primary",
        offset,
        sDelta: 0,
    }));

    const palette = [...primaries];
    let fillerRank = 1;
    while (palette.length < 4) {
        const source = primaries[(fillerRank - 1) % primaries.length];
        palette.push({
            h: source.h,
            s: source.s,
            b: clamp(source.b - 22 * fillerRank, 5, 100),
            kind: "shade",
            offset: source.offset,
            sDelta: source.sDelta,
        });
        fillerRank += 1;
    }

    return palette;
}
