import { Check, RotateCcw } from "lucide-react";
import { useTheme } from "../context/LocalThemeContext";
import { logActivity } from "./adminStore";
import { PageHeader, Panel } from "./AdminUI";

/* Light themes only: every accent passes 4.5:1 as text on its background. */
const themePresets = [
  {
    name: "Crimson (default)",
    theme: { primary: "#111111", secondary: "#ffffff", background: "#ffffff", text: "#111111", mutedText: "#666666", accent: "#e32636", border: "#e5e5e5" },
    typography: { headingFont: "Inter", bodyFont: "Inter" },
  },
  {
    name: "Electric Blue",
    theme: { primary: "#0f172a", secondary: "#ffffff", background: "#f8fafc", text: "#0f172a", mutedText: "#64748b", accent: "#2563eb", border: "#e2e8f0" },
    typography: { headingFont: "Space Grotesk", bodyFont: "Inter" },
  },
  {
    name: "Ultra Violet",
    theme: { primary: "#1e1033", secondary: "#ffffff", background: "#faf8ff", text: "#1e1033", mutedText: "#6b6480", accent: "#7c3aed", border: "#ebe7f3" },
    typography: { headingFont: "Outfit", bodyFont: "Outfit" },
  },
  {
    name: "Emerald",
    theme: { primary: "#0b1f17", secondary: "#ffffff", background: "#f7fbf9", text: "#0b1f17", mutedText: "#5b6b64", accent: "#047857", border: "#e1ebe6" },
    typography: { headingFont: "Manrope", bodyFont: "Manrope" },
  },
  {
    name: "Sunset",
    theme: { primary: "#1c1410", secondary: "#ffffff", background: "#fffaf5", text: "#1c1410", mutedText: "#6f6259", accent: "#c2410c", border: "#f1e6dc" },
    typography: { headingFont: "Poppins", bodyFont: "DM Sans" },
  },
  {
    name: "Sakura",
    theme: { primary: "#1f1320", secondary: "#ffffff", background: "#fffafc", text: "#1f1320", mutedText: "#6f5f6c", accent: "#be185d", border: "#f3e4ec" },
    typography: { headingFont: "Poppins", bodyFont: "Poppins" },
  },
];

const fonts = ["Inter", "Poppins", "Space Grotesk", "Outfit", "Manrope", "DM Sans", "Sora"];

const colorFields = [
  ["accent", "Accent", "Buttons, highlights, badges"],
  ["primary", "Primary", "Dark buttons, borders, tabs"],
  ["text", "Text", "Headings and body copy"],
  ["mutedText", "Muted text", "Captions and meta info"],
  ["background", "Page background", "Behind every section"],
  ["secondary", "Surface", "Cards and panels"],
  ["border", "Borders", "Dividers and outlines"],
];

const sameTheme = (a, b) => Object.keys(b).every((key) => a[key]?.toLowerCase() === b[key].toLowerCase());

export default function AppearancePage() {
  const { settings, updateTheme, updateTypography, resetSettings, applyTheme } = useTheme();
  const { theme, typography } = settings;

  return (
    <>
      <PageHeader eyebrow="Appearance" title="Website theme" description="Changes apply instantly across the whole site and are remembered in this browser.">
        <button
          type="button"
          className="adm-btn adm-btn-ghost"
          onClick={() => {
            resetSettings();
            logActivity("Reset the theme to default");
          }}
        >
          <RotateCcw size={15} /> Reset to default
        </button>
      </PageHeader>

      <Panel title="Theme presets">
        <div className="adm-presets">
          {themePresets.map((preset) => {
            const active = sameTheme(theme, preset.theme);
            return (
              <button
                key={preset.name}
                type="button"
                className={`adm-preset ${active ? "active" : ""}`}
                aria-pressed={active}
                onClick={() => {
                  applyTheme(preset.theme, preset.typography);
                  logActivity(`Applied the “${preset.name}” theme`);
                }}
                style={{ "--p-bg": preset.theme.background, "--p-primary": preset.theme.primary, "--p-accent": preset.theme.accent, "--p-text": preset.theme.text, "--p-border": preset.theme.border }}
              >
                <span className="adm-preset-sample" aria-hidden="true">
                  <i className="bar" />
                  <i className="line" />
                  <i className="line short" />
                  <i className="btn" />
                  <i className="dot" />
                </span>
                <span className="adm-preset-name">
                  {active && <Check size={14} />} {preset.name}
                </span>
                <small>{preset.typography.headingFont}</small>
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="adm-grid adm-grid-2-1">
        <Panel title="Custom colours">
          <div className="adm-colors">
            {colorFields.map(([key, label, hint]) => (
              <label key={key} className="adm-color">
                <input type="color" value={theme[key]} onChange={(event) => updateTheme(key, event.target.value)} aria-label={`${label} colour`} />
                <div>
                  <strong>{label}</strong>
                  <small>{hint}</small>
                </div>
                <input className="adm-color-hex" value={theme[key]} onChange={(event) => updateTheme(key, event.target.value)} aria-label={`${label} hex value`} maxLength={7} />
              </label>
            ))}
          </div>
        </Panel>

        <div className="adm-stack">
          <Panel title="Typography">
            <div className="adm-form">
              <label>
                <span>Heading font</span>
                <select value={typography.headingFont} onChange={(event) => updateTypography("headingFont", event.target.value)}>
                  {fonts.map((font) => <option key={font}>{font}</option>)}
                </select>
              </label>
              <label>
                <span>Body font</span>
                <select value={typography.bodyFont} onChange={(event) => updateTypography("bodyFont", event.target.value)}>
                  {fonts.map((font) => <option key={font}>{font}</option>)}
                </select>
              </label>
              <label>
                <span>Heading weight · {typography.headingWeight}</span>
                <input type="range" min="500" max="900" step="100" value={typography.headingWeight} onChange={(event) => updateTypography("headingWeight", Number(event.target.value))} />
              </label>
            </div>
          </Panel>

          <Panel title="Preview">
            <div className="adm-theme-preview">
              <span className="fv-eyebrow">FandomVerse / Anime</span>
              <h3 style={{ fontFamily: `"${typography.headingFont}", system-ui, sans-serif`, fontWeight: typography.headingWeight }}>Enter the Anime World</h3>
              <p style={{ fontFamily: `"${typography.bodyFont}", system-ui, sans-serif` }}>Legendary battles, unforgettable heroes and the stories that shaped a global fandom.</p>
              <div className="adm-actions">
                <span className="fv-button">Primary button</span>
                <span className="fv-button-outline">Outline</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
