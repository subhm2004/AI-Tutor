import katex from "katex";
import "katex/contrib/mhchem/mhchem.js";

export function renderKatex(tex: string, displayMode = false): string {
  const trimmed = tex.trim();
  if (!trimmed) return "";

  try {
    return katex.renderToString(trimmed, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
    });
  } catch {
    return trimmed;
  }
}
