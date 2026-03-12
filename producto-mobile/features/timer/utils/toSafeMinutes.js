export function toSafeMinutes(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
}
