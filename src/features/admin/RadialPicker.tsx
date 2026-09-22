import { useLayoutEffect, useRef, useState } from "react";
import { FolderKanban } from "lucide-react";

export type RadialPickerItem = { id: string; label: string };

// Regular pointy-top/pointy-bottom hexagon.
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

// 270°, not a full 360° circle — leaves a 90° gap (centered on the
// bottom) so nodes never stack directly under the hub, and the whole
// thing reads as an arc fanning out rather than a closed ring.
const ARC_START_DEG = -135; // upper-left
const ARC_SPAN_DEG = 270;

/**
 * Generic "pick one of N things" control for the admin sector: one
 * card, no button nested inside it. Clicking it fans every option
 * out around itself as hexagonal nodes across a 270° arc, connected
 * back to the hub by smooth curves that leave from the hub's edge
 * (not its center) and bow toward each node — nodes directly above
 * or below the hub get a straight connector, everything off-axis
 * curves, same as an org-chart/mind-map connector.
 *
 * Deliberately generic (id/label pairs in, id out) so it's reusable
 * for other admin modules later, not just projects.
 *
 * Icons: every node uses the same FolderKanban icon rather than
 * guessing a fitting icon per label — matching an arbitrary project
 * name to the "right" icon isn't reliably solvable without either a
 * hand-picked per-item icon field or a fuzzy keyword table that will
 * often guess wrong. If per-project icons matter later, the natural
 * path is an optional `icon` field items can carry.
 *
 * Mobile scaling: the hub, every node, and the connector SVG all live
 * inside one fixed STAGE x STAGE px box, positioned using raw STAGE-unit
 * pixel values throughout (hex size, label width, gaps, node positions).
 * That whole box gets ONE CSS `transform: scale(fitScale)` applied to it
 * when the available width is less than STAGE. Because every value inside
 * is just a proportion of that one box, they all shrink together in lock
 * step — there's no separate per-element scaling logic to keep in sync,
 * and nothing can independently drift and overflow the viewport.
 */
export function RadialPicker({
  category,
  hubLabel,
  items,
  onSelect,
}: {
  /** Small uppercase label above the instruction, e.g. "Project". */
  category: string;
  /** The instruction itself, e.g. "Click to view and select project". */
  hubLabel: string;
  items: RadialPickerItem[];
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // Fixed stage in px — every position/size below is a raw number in
  // this same coordinate space. The stage itself is what gets scaled
  // down to fit small screens, not any individual value inside it.
  const STAGE = 620;
  const CENTER = STAGE / 2;
  const RADIUS = 220;

  // Node = hexagon icon + label sitting beside it (not under it), so
  // the connector line can land exactly on the hexagon instead of
  // passing behind or through the text. Fixed sizes (rather than
  // measured) keep every node's hex-to-point math identical.
  const HEX_SIZE = 56;
  const NODE_GAP = 12;
  const LABEL_W = 112;
  const NODE_TOTAL_W = HEX_SIZE + NODE_GAP + LABEL_W;

  const outerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLButtonElement>(null);

  // How much to shrink the STAGE x STAGE box so it fits the available
  // width. 1 = full size (desktop). Recomputed on resize while expanded.
  const [fitScale, setFitScale] = useState(1);

  // Half-width/half-height of the hub button, in STAGE units, so
  // connector lines can start exactly at its edge instead of a guessed
  // offset. Measured from the real DOM node because the button's size
  // depends on the label text and isn't fixed. getBoundingClientRect()
  // already reflects the stage's CSS transform:scale, so converting
  // back to STAGE units is just dividing by that same fitScale.
  const [hubHalf, setHubHalf] = useState({ w: 90, h: 34 });

  useLayoutEffect(() => {
    if (!expanded) return;

    const measureFit = () => {
      // Viewport-relative on purpose, matching this component's original
      // "cap at 92vw" intent — it fits itself to the screen rather than
      // to a specific parent container.
      const availableWidth = window.innerWidth * 0.92;
      setFitScale(Math.min(1, availableWidth / STAGE));
    };

    measureFit();
    window.addEventListener("resize", measureFit);
    return () => window.removeEventListener("resize", measureFit);
  }, [expanded]);

  useLayoutEffect(() => {
    if (!expanded || !hubRef.current) return;

    const measureHub = () => {
      const hubRect = hubRef.current!.getBoundingClientRect();
      setHubHalf({
        w: hubRect.width / 2 / fitScale,
        h: hubRect.height / 2 / fitScale,
      });
    };

    measureHub();
    const ro = new ResizeObserver(measureHub);
    ro.observe(hubRef.current);
    return () => ro.disconnect();
  }, [expanded, fitScale]);

  const positions = items.map((item, i) => {
    const angleDeg =
      items.length === 1
        ? ARC_START_DEG + ARC_SPAN_DEG / 2
        : ARC_START_DEG + (i / (items.length - 1)) * ARC_SPAN_DEG;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      ...item,
      x: CENTER + RADIUS * Math.sin(angleRad),
      y: CENTER - RADIUS * Math.cos(angleRad),
    };
  });

  // Where a straight ray from the hub's center to (x, y) crosses the
  // hub's rectangular edge — this is the connector's real start
  // point, not the dead center.
  const edgePointFor = (x: number, y: number) => {
    const dx = x - CENTER;
    const dy = y - CENTER;
    const scale = 1 / Math.max(Math.abs(dx) / hubHalf.w, Math.abs(dy) / hubHalf.h);
    return { x: CENTER + dx * scale, y: CENTER + dy * scale };
  };

  // Smooth "elbow" connector: leaves the hub edge horizontally, then
  // curves to meet the node's height. Nodes sitting directly above
  // or below the hub (dx ≈ 0) collapse this into a straight vertical
  // line automatically, matching the reference layout.
  const pathFor = (edge: { x: number; y: number }, node: { x: number; y: number }) => {
    const midX = edge.x + (node.x - edge.x) / 2;
    return `M ${edge.x} ${edge.y} C ${midX} ${edge.y}, ${midX} ${node.y}, ${node.x} ${node.y}`;
  };

  // Collapsed: just the hub, centered by the flex wrapper, natural size.
  // Expanded: the wrapper's own box is sized to the SCALED footprint
  // (STAGE * fitScale) so surrounding layout doesn't reserve a giant
  // 620px gap on a phone — CSS transform:scale shrinks what's drawn,
  // not the layout box, so that has to be set explicitly here.
  const wrapperStyle = expanded
    ? { width: STAGE * fitScale, height: STAGE * fitScale }
    : undefined;

  return (
    <div ref={outerRef} className="relative flex items-center justify-center" style={wrapperStyle}>
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="z-10 flex flex-col items-center gap-1 px-6 py-4 rounded-2xl
            bg-white/[0.04] border border-teal-500/30 hover:border-teal-500/50 hover:bg-teal-500/10
            transition-all duration-200 whitespace-nowrap"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-white/30">{category}</span>
          <span className="text-lg text-teal-300 font-bold">{hubLabel}</span>
        </button>
      )}

      {expanded && (
        <div
          className="absolute top-0 left-0"
          style={{
            width: STAGE,
            height: STAGE,
            transform: `scale(${fitScale})`,
            transformOrigin: "top left",
          }}
        >
          <svg viewBox={`0 0 ${STAGE} ${STAGE}`} className="absolute inset-0 w-full h-full pointer-events-none">
            {positions.map((p) => {
              const edge = edgePointFor(p.x, p.y);
              return (
                <path
                  key={`line-${p.id}`}
                  d={pathFor(edge, p)}
                  fill="none"
                  stroke="rgba(45, 212, 191, 0.55)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* The hub IS the button — no inner button nested in a card. */}
          <button
            ref={hubRef}
            type="button"
            onClick={() => setExpanded(false)}
            style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            className="z-10 flex flex-col items-center gap-1 px-6 py-4 rounded-2xl
              bg-white/[0.04] border border-teal-500/30 hover:border-teal-500/50 hover:bg-teal-500/10
              transition-all duration-200 whitespace-nowrap"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-white/30">{category}</span>
            <span className="text-lg text-teal-300 font-bold">{hubLabel}</span>
          </button>

          {positions.map((p) => {
            // Label goes on whichever side points away from the hub,
            // so it never sits between the hex and the connector
            // line. Nodes exactly above/below the hub (dx = 0) default
            // to the right, matching the reference layout.
            const onRight = p.x >= CENTER;
            // Shift the whole row so the hex — not the row's midpoint —
            // lands exactly on the arc point: on the right, the hex is
            // first in the row, so shift left by half its width; on the
            // left, the row is reversed (hex last, i.e. visually
            // rightmost), so shift left by everything except that half.
            const xShift = onRight ? -(HEX_SIZE / 2) : -(NODE_TOTAL_W - HEX_SIZE / 2);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  width: NODE_TOTAL_W,
                  transform: `translate(${xShift}px, -50%)`,
                }}
                className={`flex items-center gap-3 group ${onRight ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  style={{ clipPath: HEX_CLIP, width: HEX_SIZE, height: HEX_SIZE }}
                  className="shrink-0 flex items-center justify-center bg-white/[0.04] border border-teal-500/30
                    group-hover:bg-teal-500/15 group-hover:border-teal-500/60 transition-all duration-200"
                >
                  <FolderKanban className="w-5 h-5 text-teal-400/80 group-hover:text-teal-300 transition-colors" />
                </div>
                <span
                  style={{ width: LABEL_W }}
                  className={`shrink-0 text-sm font-bold text-white/70 group-hover:text-white leading-snug transition-colors ${
                    onRight ? "text-left" : "text-right"
                  }`}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}