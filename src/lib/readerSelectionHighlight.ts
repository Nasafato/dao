const READER_SELECTION_HIGHLIGHT = "reader-character-selection";

type HighlightRegistry = {
  delete: (name: string) => boolean | void;
  set: (name: string, highlight: unknown) => void;
};

type CssWithHighlights = {
  highlights?: HighlightRegistry;
};

type WindowWithHighlight = Window &
  typeof globalThis & {
    Highlight?: new (...ranges: Range[]) => unknown;
  };

export function highlightReaderRange(range: Range) {
  document.documentElement.dataset.readerCharacterSelection = "true";
  window.getSelection()?.removeAllRanges();

  const css = window.CSS as CssWithHighlights | undefined;
  const HighlightConstructor = (window as WindowWithHighlight).Highlight;
  if (!css?.highlights || !HighlightConstructor) return;

  css.highlights.set(
    READER_SELECTION_HIGHLIGHT,
    new HighlightConstructor(range)
  );
}

export function clearReaderSelectionHighlight() {
  delete document.documentElement.dataset.readerCharacterSelection;
  window.getSelection()?.removeAllRanges();

  const css = window.CSS as CssWithHighlights | undefined;
  css?.highlights?.delete(READER_SELECTION_HIGHLIGHT);
}
