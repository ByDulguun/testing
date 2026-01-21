// utils/image.ts
export const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#eee" offset="20%" />
        <stop stop-color="#ddd" offset="50%" />
        <stop stop-color="#eee" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#eee" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x"
      from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite" />
  </svg>
`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export function buildImgUrl(base: string | undefined, w: number, h: number) {
  const src = base || "";
  const dpr =
    typeof window !== "undefined"
      ? Math.min(2, window.devicePixelRatio || 1)
      : 1;

  return `${src}${
    src.includes("?") ? "&" : "?"
  }w=${w}&h=${h}&fit=crop&auto=format&q=60&dpr=${dpr}`;
}
