import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminRoute,
  SECRET_CLICK_COUNT,
  SECRET_CLICK_WINDOW_MS,
} from "../../../config/adminAccess";

/**
 * Returns an onClick handler. Attach it to any element (footer text,
 * a logo, a dot in the corner — your call) and clicking it
 * SECRET_CLICK_COUNT times within SECRET_CLICK_WINDOW_MS navigates to
 * the hidden admin route. Mirrors the "tap 7 times" pattern from
 * Android's Developer Options.
 *
 * Usage:
 *   const onSecretClick = useSecretClickSequence();
 *   <p onClick={onSecretClick}>© 2026 Your Name</p>
 */
export function useSecretClickSequence() {
  const navigate = useNavigate();
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSecretClick = useCallback(() => {
    countRef.current += 1;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, SECRET_CLICK_WINDOW_MS);

    if (countRef.current >= SECRET_CLICK_COUNT) {
      countRef.current = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
      navigate(getAdminRoute());
    }
  }, [navigate]);

  return onSecretClick;
}