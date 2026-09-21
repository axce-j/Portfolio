import { createContext, useContext, type ReactNode } from "react";

// Default true: the public site always gets the hover-icon +
// click-to-preview behavior. The admin Visual Editor reuses the exact
// same Hero/Feature/Highlight/Gallery components as the public page
// (see VisualEditor.tsx), which is great for "no guessing what a
// change will look like" — but those same components render images
// through ExpandableImage, whose own onClick (open lightbox) and
// hover overlay would otherwise sit on top of / fight with the
// editor's own hover-to-replace overlay and click-to-edit-feature
// handlers. Wrapping the editor's render tree in
// <ImagePreviewDisabled> turns ExpandableImage back into a plain,
// non-interactive BlurredImageFrame for that subtree only — the
// public site is never wrapped in this, so it's unaffected.
const ImagePreviewContext = createContext(true);

export function ImagePreviewDisabled({ children }: { children: ReactNode }) {
  return <ImagePreviewContext.Provider value={false}>{children}</ImagePreviewContext.Provider>;
}

export function useImagePreviewEnabled(): boolean {
  return useContext(ImagePreviewContext);
}