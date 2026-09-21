import { useParams } from "react-router-dom";
import { useState } from "react";
import { isValidAdminSuffix } from "@/config/adminAccess";

const SESSION_KEY = "admin-route-authorized";

/**
 * Sits behind a param route (`${ADMIN_ROUTE_PREFIX}:suffix`) instead
 * of the old exact-string route that was recomputed from `new Date()`
 * on every render of <App />. That recomputation was the bug: once
 * the wall clock crossed into the next rotation window — as short as
 * ~72s in this project's current config — the Route's `path` prop
 * itself changed, and the URL already sitting in the address bar
 * stopped matching anything, even mid-session.
 *
 * Here, the suffix is checked against the valid window(s) exactly
 * once, the first time this component mounts. `sessionStorage` (not
 * component state alone) backs that up so a hard refresh or a
 * navigation elsewhere-and-back within the same tab doesn't force a
 * re-check either — once you're in, you stay in until you actually
 * close the tab. This only relaxes the *obscurity* layer; every
 * actual write still re-checks ADMIN_UPLOAD_PASSWORD server-side on
 * every request, same as before.
 */
export default function AdminRouteGate({ children }: { children: React.ReactNode }) {
  const { suffix = "" } = useParams<{ suffix: string }>();

  const [authorized] = useState<boolean>(() => {
    if (sessionStorage.getItem(SESSION_KEY) === suffix) return true;
    const valid = isValidAdminSuffix(suffix);
    if (valid) sessionStorage.setItem(SESSION_KEY, suffix);
    return valid;
  });

  if (!authorized) return null;
  return <>{children}</>;
}