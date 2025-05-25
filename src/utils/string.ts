export function combineUrl(base: string, ...paths: string[]): string {
    return `${base}/${paths.join('/')}`;
}
