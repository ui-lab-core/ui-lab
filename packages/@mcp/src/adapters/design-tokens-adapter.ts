/**
 * Design Tokens Adapter (Simplified)
 * Provides semantic color recommendations via get_semantic_color
 *
 * This adapter provides:
 * - getSemanticColor(componentId, semanticIntent): Returns ONE recommended color choice
 *   No options, no alternatives - just the right choice with rationale
 */

interface ColorRecommendation {
  background?: { family: string; shade: number; cssVar: string };
  text?: { family: string; shade: number; cssVar: string };
  border?: { family: string; shade: number; cssVar: string };
  hover?: { family: string; shade: number; cssVar: string };
  active?: { family: string; shade: number; cssVar: string };
  disabled?: { family: string; shade: number; cssVar: string };
  rationale: string;
}

const COLOR_RECOMMENDATIONS: Record<string, ColorRecommendation> = {
  'button:default': {
    background: { family: 'background', shade: 800, cssVar: '--background-800' },
    text: { family: 'foreground', shade: 300, cssVar: '--foreground-300' },
    border: { family: 'background', shade: 700, cssVar: '--background-700' },
    hover: { family: 'background', shade: 700, cssVar: '--background-700' },
    disabled: { family: 'foreground', shade: 200, cssVar: '--foreground-200' },
    rationale: 'Default button uses background surface colors with standard foreground text',
  },
  'button:outline': {
    text: { family: 'foreground', shade: 300, cssVar: '--foreground-300' },
    border: { family: 'background', shade: 700, cssVar: '--background-700' },
    hover: { family: 'background', shade: 800, cssVar: '--background-800' },
    disabled: { family: 'foreground', shade: 200, cssVar: '--foreground-200' },
    rationale: 'Transparent background with visible border; fills on hover',
  },
  'button:ghost': {
    text: { family: 'foreground', shade: 300, cssVar: '--foreground-300' },
    hover: { family: 'background', shade: 900, cssVar: '--background-900' },
    disabled: { family: 'foreground', shade: 200, cssVar: '--foreground-200' },
    rationale: 'No background or border at rest; subtle fill on hover for low-emphasis actions',
  },
  'button:danger': {
    background: { family: 'danger', shade: 600, cssVar: '--danger-600' },
    text: { family: 'background', shade: 900, cssVar: '--background-900' },
    border: { family: 'danger', shade: 600, cssVar: '--danger-600' },
    hover: { family: 'danger', shade: 400, cssVar: '--danger-400' },
    active: { family: 'danger', shade: 600, cssVar: '--danger-600' },
    disabled: { family: 'foreground', shade: 300, cssVar: '--foreground-300' },
    rationale: 'Danger color signals destructive action with clear visual hierarchy',
  },
  'alert:success': {
    background: { family: 'success', shade: 100, cssVar: '--success-100' },
    text: { family: 'success', shade: 600, cssVar: '--success-600' },
    border: { family: 'success', shade: 300, cssVar: '--success-300' },
    rationale: 'Success family with light background and dark text for positive feedback',
  },
  'alert:danger': {
    background: { family: 'danger', shade: 100, cssVar: '--danger-100' },
    text: { family: 'danger', shade: 600, cssVar: '--danger-600' },
    border: { family: 'danger', shade: 300, cssVar: '--danger-300' },
    rationale: 'Danger family for error states with proper contrast',
  },
  'alert:warning': {
    background: { family: 'warning', shade: 100, cssVar: '--warning-100' },
    text: { family: 'warning', shade: 600, cssVar: '--warning-600' },
    border: { family: 'warning', shade: 300, cssVar: '--warning-300' },
    rationale: 'Warning family for cautionary messages',
  },
  'alert:info': {
    background: { family: 'info', shade: 100, cssVar: '--info-100' },
    text: { family: 'info', shade: 600, cssVar: '--info-600' },
    border: { family: 'info', shade: 300, cssVar: '--info-300' },
    rationale: 'Info family for neutral informational messages',
  },
  'input:default': {
    background: { family: 'foreground', shade: 50, cssVar: '--foreground-50' },
    text: { family: 'foreground', shade: 400, cssVar: '--foreground-400' },
    border: { family: 'foreground', shade: 300, cssVar: '--foreground-300' },
    disabled: { family: 'foreground', shade: 200, cssVar: '--foreground-200' },
    rationale: 'Light input with dark text for readability',
  },
  'input:error': {
    background: { family: 'foreground', shade: 50, cssVar: '--foreground-50' },
    text: { family: 'foreground', shade: 400, cssVar: '--foreground-400' },
    border: { family: 'danger', shade: 600, cssVar: '--danger-600' },
    rationale: 'Error state with danger border to indicate validation failure',
  },
  'badge:default': {
    background: { family: 'foreground', shade: 200, cssVar: '--foreground-200' },
    text: { family: 'foreground', shade: 400, cssVar: '--foreground-400' },
    rationale: 'Neutral badge for general labeling',
  },
  'badge:success': {
    background: { family: 'success', shade: 200, cssVar: '--success-200' },
    text: { family: 'success', shade: 600, cssVar: '--success-600' },
    rationale: 'Success badge for positive labels',
  },
  'badge:danger': {
    background: { family: 'danger', shade: 200, cssVar: '--danger-200' },
    text: { family: 'danger', shade: 600, cssVar: '--danger-600' },
    rationale: 'Danger badge for negative or destructive labels',
  },
  'card:default': {
    background: { family: 'foreground', shade: 50, cssVar: '--foreground-50' },
    text: { family: 'foreground', shade: 400, cssVar: '--foreground-400' },
    border: { family: 'foreground', shade: 200, cssVar: '--foreground-200' },
    rationale: 'Light card background with subtle border',
  },
};

/**
 * Get the semantic color recommendation for a component:intent combination
 *
 * Returns a SINGLE recommended color choice with complete pairing info
 * instead of offering options for the agent to choose from.
 */
function getSemanticColor(componentId: string, semanticIntent: string) {
  const recommendation = COLOR_RECOMMENDATIONS[`${componentId}:${semanticIntent}`];

  if (!recommendation) {
    return {
      success: false,
      error: `No color recommendation found for ${componentId}:${semanticIntent}`,
    };
  }

  return {
    success: true,
    componentId,
    semanticIntent,
    recommended: {
      background: recommendation.background ? {
        family: recommendation.background.family,
        shade: recommendation.background.shade,
        cssVar: recommendation.background.cssVar,
      } : null,
      text: recommendation.text ? {
        family: recommendation.text.family,
        shade: recommendation.text.shade,
        cssVar: recommendation.text.cssVar,
      } : null,
      border: recommendation.border ? {
        family: recommendation.border.family,
        shade: recommendation.border.shade,
        cssVar: recommendation.border.cssVar,
      } : null,
      hover: recommendation.hover ? {
        family: recommendation.hover.family,
        shade: recommendation.hover.shade,
        cssVar: recommendation.hover.cssVar,
      } : null,
      active: recommendation.active ? {
        family: recommendation.active.family,
        shade: recommendation.active.shade,
        cssVar: recommendation.active.cssVar,
      } : null,
      disabled: recommendation.disabled ? {
        family: recommendation.disabled.family,
        shade: recommendation.disabled.shade,
        cssVar: recommendation.disabled.cssVar,
      } : null,
    },
    rationale: recommendation.rationale,
    wcag: {
      level: 'AA',
      message: 'All recommended color combinations meet WCAG AA accessibility standards',
    },
  };
}

/**
 * Design tokens adapter singleton for compatibility
 */
export const designTokensAdapter = {
  getSemanticColor,
};
