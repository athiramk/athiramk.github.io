import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const fontFile = (weight: number) =>
  readFileSync(require.resolve(`@fontsource/manrope/files/manrope-latin-${weight}-normal.woff`));

let fonts: { name: string; data: Buffer; weight: 300 | 700; style: "normal" }[] | undefined;
const loadFonts = () =>
  (fonts ??= [
    { name: "Manrope", data: fontFile(300), weight: 300, style: "normal" },
    { name: "Manrope", data: fontFile(700), weight: 700, style: "normal" },
  ]);

const INK = "#26211d";
const MUTE = "#6f665e";
const ACCENT = "#c8512c";
const SOFT = "#fff3e6";

type Card = { title: string; summary?: string; tags?: string[] };

const div = (style: Record<string, unknown>, children?: unknown) => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});

/** Render a 1200x630 share card as PNG bytes. */
export async function renderCard({ title, summary = "", tags = [] }: Card): Promise<Buffer> {
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 62 : 72;

  const tree = div(
    { width: 1200, height: 630, background: "#fdfbf7", fontFamily: "Manrope", flexDirection: "column" },
    [
      div({ height: 14, background: ACCENT }),
      div({ flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "56px 80px 52px" }, [
        div({ flexDirection: "column" }, [
          div({ fontSize: 26, fontWeight: 700, color: ACCENT, marginBottom: 28 }, tags.length ? tags.join("  /  ") : "athiramk.com"),
          div({ fontSize: titleSize, fontWeight: 700, color: INK, lineHeight: 1.12, letterSpacing: -1.5, lineClamp: 3 }, title),
          summary
            ? div({ fontSize: 30, fontWeight: 300, color: MUTE, lineHeight: 1.4, marginTop: 26, lineClamp: 2 }, summary)
            : div({}),
        ]),
        div({ alignItems: "center", justifyContent: "space-between" }, [
          div({ flexDirection: "column" }, [
            div({ fontSize: 30, fontWeight: 700, color: INK }, "Athira M Kamala"),
            div({ fontSize: 24, fontWeight: 300, color: MUTE, marginTop: 4 }, "Senior Software Engineer"),
          ]),
          div({ fontSize: 24, fontWeight: 700, color: ACCENT, background: SOFT, padding: "10px 22px", borderRadius: 12 }, "athiramk.com"),
        ]),
      ]),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
