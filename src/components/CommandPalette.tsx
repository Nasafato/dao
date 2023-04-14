// MediaWindow.js
import { createPortal } from "react-dom";
import { atom, useAtom } from "jotai";
import React, {
  useContext,
  createContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Ref,
  MutableRefObject,
} from "react";
import { useLogPropChanges } from "../hooks";
// import MediaControls from "./MediaControls";
// import { AudioPlayer } from "./HeadlessAudioPlayer";

// MediaWindowContext.tsx

const commandPaletteAtom = atom({
  isOpen: false,
});

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    containerRef.current = document.getElementById("command-palette-portal");
  }, []);

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (!isOpen) {
        return;
      }
      if (e.key.toLowerCase() === "escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [isOpen]);

  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<React.ReactNode>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.startsWith("g")) {
      const rest = value.slice(1);
      const number = Number.parseInt(rest, 10);
      if (Number.isNaN(number)) {
        return;
      }
      if (number > 81 || number < 1) {
        return;
      }

      location.href = `#dao${number}`;
      setValue("");
      setPreview("");
      setIsOpen(false);
    } else if (value.trim() === "") {
      setIsOpen(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    if (value.startsWith("g")) {
      setPreview("Go to verse: ");
      const rest = value.slice(1);
      const number = Number.parseInt(rest, 10);
      if (Number.isNaN(number)) {
        // setPreview("Go to verse: invalid verse");
        return;
      }
      if (number > 81 || number < 1) {
        // setPreview("Go to verse: invalid verse");
        return;
      }

      setPreview("Go to verse: " + number);
    } else {
      setPreview("");
    }
  };

  if (!containerRef.current || !isOpen) {
    return null;
  }
  return createPortal(
    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-md shadow-md py-3 px-2 flex items-center gap-x-2 w-[400px]">
      <form onSubmit={handleSubmit}>
        <input value={value} onChange={onChange} autoFocus></input>
      </form>
      {preview}
    </div>,
    containerRef.current
  );
}
