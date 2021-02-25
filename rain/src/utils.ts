export interface Time
{
    dt: number,
    total: number,
}

export function clamp(x: number, l: number, h: number)
{
    return Math.min(Math.max(x, l), h);
}