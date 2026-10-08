import { Marked } from "marked";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Raw HTML inside markdown is shown as text (keeps AI / pasted content safe)
const md = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, text }) {
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : "#";
      const ext = /^https?:/i.test(safe);
      return `<a href="${safe}"${ext ? ' target="_blank" rel="noopener nofollow"' : ""}>${text}</a>`;
    },
  },
});

export function renderMarkdown(src: string) {
  return md.parse(src || "", { async: false }) as string;
}
