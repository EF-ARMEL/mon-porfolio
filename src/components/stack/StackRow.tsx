import type React from "react";
import { useTranslation } from "react-i18next";
import StackLogo from "./StackLogo";
import type { Tool } from "./stack-data";

const BARS = 14;

/** Hauteurs/rythmes pseudo-aléatoires mais stables (pas de Math.random → pas d'écart SSR/client). */
function barStyle(row: number, bar: number): React.CSSProperties {
  const h = 0.18 + (((bar * 37 + row * 13) % 61) / 100) * 0.9;
  const d = 0.45 + ((bar * 7 + row * 3) % 9) / 12;
  const dl = -(((bar * 13 + row * 5) % 10) / 10);
  return { ["--h" as string]: h.toFixed(2), ["--d" as string]: `${d.toFixed(2)}s`, ["--dl" as string]: `${dl.toFixed(2)}s` };
}

type Props = {
  tool: Tool;
  index: number;
  on: boolean;
  onHover: (i: number) => void;
  onKeyFocus: (i: number) => void;
  onBlurRow: () => void;
  onActivate: (i: number, e: React.MouseEvent<HTMLButtonElement>) => void;
  onPointerDownRow: (e: React.PointerEvent<HTMLButtonElement>) => void;
};

export default function StackRow({ tool, index, on, onHover, onKeyFocus, onBlurRow, onActivate, onPointerDownRow }: Props) {
  const { t } = useTranslation();
  const role = t(`stack.${tool.id}.role`, tool.role);
  const desc = t(`stack.${tool.id}.desc`, tool.desc);
  const panelId = `stk-panel-${tool.id}`;
  const num = String(index + 1).padStart(2, "0");

  return (
    <li
      className="stk-item"
      data-on={on}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(index)}
    >
      <button
        type="button"
        className="stk-row"
        aria-expanded={on}
        aria-controls={panelId}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && onKeyFocus(index)}
        onBlur={onBlurRow}
        onPointerDown={onPointerDownRow}
        onClick={(e) => onActivate(index, e)}
      >
        <span className="stk-num">{num}</span>

        <span className="stk-name">
          <span className="stk-name-in">
            <span className="stk-name-roll">
              <span>{tool.name}</span>
              <span aria-hidden>{tool.name}</span>
            </span>
          </span>
        </span>

        <span className="stk-meter" aria-hidden>
          {Array.from({ length: BARS }, (_, b) => (
            <span key={b} className="stk-bar" style={barStyle(index, b)} />
          ))}
        </span>

        <span className="stk-role" aria-hidden>
          <span className="stk-role-k">{role}</span>
          <span className="stk-role-d">{desc}</span>
        </span>

        <span className="stk-plus" aria-hidden />
      </button>

      {/* Détail lisible au toucher et par les lecteurs d'écran. */}
      <div id={panelId} className="stk-panel" role="region" aria-label={tool.name}>
        <div className="stk-panel-in">
          <div className="stk-panel-body">
            <span className="stk-panel-logo">
              <StackLogo tool={tool} size={26} color={tool.color} />
            </span>
            <p style={{ margin: 0 }}>
              <small>{role}</small>
              {desc}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
