const READER_CHARACTER_LOOKUP_POINTER_KEY = "readerCharacterLookupPointer";
const SYNTHETIC_MOUSE_EVENT_WINDOW_MS = 350;

let clearLookupPointerTimeout: number | null = null;

export function markReaderCharacterLookupPointer() {
  document.documentElement.dataset[READER_CHARACTER_LOOKUP_POINTER_KEY] = "true";

  if (clearLookupPointerTimeout !== null) {
    window.clearTimeout(clearLookupPointerTimeout);
  }

  clearLookupPointerTimeout = window.setTimeout(() => {
    delete document.documentElement.dataset[READER_CHARACTER_LOOKUP_POINTER_KEY];
    clearLookupPointerTimeout = null;
  }, SYNTHETIC_MOUSE_EVENT_WINDOW_MS);
}

export function consumeReaderCharacterLookupPointer() {
  if (
    document.documentElement.dataset[READER_CHARACTER_LOOKUP_POINTER_KEY] !==
    "true"
  ) {
    return false;
  }

  delete document.documentElement.dataset[READER_CHARACTER_LOOKUP_POINTER_KEY];

  if (clearLookupPointerTimeout !== null) {
    window.clearTimeout(clearLookupPointerTimeout);
    clearLookupPointerTimeout = null;
  }

  return true;
}
