import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  SECRET_PHRASE,
  SECRET_PHRASE_TIMEOUT_MS,
} from "../../../config/adminAccess";

/**
 * Mount once at the app root (e.g. in App.tsx):
 *   useSecretTypedPhrase();
 *
 * Listens globally for SECRET_PHRASE being typed within
 * SECRET_PHRASE_TIMEOUT_MS per keystroke, then navigates to the
 * hidden admin route. Ignores keystrokes while focus is inside an
 * <input> or <textarea>, so it never interferes with normal typing
 * anywhere else on the site (contact forms, search boxes, etc.).
 */
export function useSecretTypedPhrase() {
  const navigate = useNavigate();
  const bufferRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key.length !== 1) return; // ignore Shift, Arrow keys, etc.

      bufferRef.current = (bufferRef.current + e.key)
        .slice(-SECRET_PHRASE.length)
        .toLowerCase();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, SECRET_PHRASE_TIMEOUT_MS);

      if (bufferRef.current === SECRET_PHRASE.toLowerCase()) {
        bufferRef.current = "";
        if (timerRef.current) clearTimeout(timerRef.current);
        navigate(ADMIN_ROUTE);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [navigate]);
}