export const range = (n: number) => {
    return new Array(n)
    .fill(1)
    .map((v, i) => i + 1);
};
