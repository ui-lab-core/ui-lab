# Typography Metrics API Guide

## Overview

The Typography Metrics API enables agents to programmatically query and compare font metrics. The goal is to align target fonts with Karla's baseline metrics through iterative adjustments.

## Base URL

```
http://localhost:3000/api/dev/typography
```

## API Endpoints

### 1. **Get API Documentation**
```
GET /docs
```

Returns this comprehensive API documentation as JSON, including all endpoints, available fonts, and metric fields.

**Example:**
```bash
curl http://localhost:3000/api/dev/typography/docs
```

---

### 2. **Get Karla Baseline (Reference)**
```
GET /karla
```

Returns Karla's baseline metrics—the target for font alignment.

**Query Parameters:**
- `category` (string): `body` | `header` | `mono` (default: `body`)

**Example:**
```bash
curl "http://localhost:3000/api/dev/typography/karla?category=body"
```

**Response:**
```json
{
  "name": "Karla",
  "family": "\"Karla Variable\", system-ui, sans-serif",
  "category": "body",
  "metrics": {
    "fontSizeScale": 1,
    "fontWeightScale": 1,
    "typeSizeRatio": 1.2
  }
}
```

---

### 3. **Get Metrics for a Specific Font**
```
GET /metrics
```

Returns the current configuration metrics for any font.

**Query Parameters:**
- `fontName` (string, **required**): Font name (e.g., `Inter`, `Geist Sans`, `Work Sans`, `Karla`)
- `category` (string): `body` | `header` | `mono` (default: `body`)

**Example:**
```bash
curl "http://localhost:3000/api/dev/typography/metrics?fontName=Inter&category=body"
```

**Response:**
```json
{
  "name": "Inter",
  "family": "\"Inter Variable\", system-ui, sans-serif",
  "category": "body",
  "metrics": {
    "fontSizeScale": 0.97,
    "fontWeightScale": 1,
    "typeSizeRatio": 1.2,
    "headerLetterSpacingScale": -1.2,
    "bodyLetterSpacingScale": 0.2,
    "bodyFontSizeScale": 0.995
  }
}
```

---

### 4. **List All Available Fonts**
```
GET /fonts
```

Returns all fonts in a category with their current metrics.

**Query Parameters:**
- `category` (string): `body` | `header` | `mono` (default: `body`)

**Example:**
```bash
curl "http://localhost:3000/api/dev/typography/fonts?category=body"
```

**Response:**
```json
{
  "category": "body",
  "count": 4,
  "fonts": [
    {
      "name": "Karla",
      "family": "\"Karla Variable\", system-ui, sans-serif",
      "metrics": { "fontSizeScale": 1, "fontWeightScale": 1, "typeSizeRatio": 1.2 }
    },
    {
      "name": "Inter",
      "family": "\"Inter Variable\", system-ui, sans-serif",
      "metrics": { "fontSizeScale": 0.97, ... }
    },
    // ... more fonts
  ]
}
```

---

### 5. **Compare Target Font Against Reference (Karla)**
```
GET /compare
```

Compares a target font against a reference (default: Karla) and provides delta measurements and suggested adjustments.

**Query Parameters:**
- `targetFont` (string, **required**): Font to analyze
- `referenceFont` (string, default: `Karla`): Font to compare against
- `category` (string): `body` | `header` | `mono` (default: `body`)
- `threshold` (number): Percentage threshold for suggesting adjustments (0-1, default: 0.05)
- `suggestions` (boolean): Include adjustment suggestions in response (default: true)

**Example:**
```bash
curl "http://localhost:3000/api/dev/typography/compare?targetFont=Inter&referenceFont=Karla&suggestions=true"
```

**Response:**
```json
{
  "comparison": {
    "targetFont": "Inter",
    "referenceFont": "Karla",
    "metrics": {
      "fontSizeScale": {
        "target": 0.97,
        "reference": 1,
        "delta": -0.03,
        "deltaPercent": -3
      },
      "fontWeightScale": {
        "target": 1,
        "reference": 1,
        "delta": 0,
        "deltaPercent": 0
      },
      // ... more metrics
    }
  },
  "suggestions": [
    {
      "metric": "fontSizeScale",
      "currentValue": 0.97,
      "suggestedValue": 1,
      "reason": "Differs by 3% from Karla"
    }
  ]
}
```

---

### 6. **Propose Metric Adjustments**
```
POST /adjust
```

Computes and validates proposed metric changes. This endpoint doesn't persist changes—it helps the agent preview what adjustments would look like before manual integration.

**Request Body:**
```json
{
  "fontName": "Inter",
  "category": "body",
  "metrics": {
    "fontSizeScale": 1.0,
    "headerLetterSpacingScale": -1.2
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/dev/typography/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "fontName": "Inter",
    "category": "body",
    "metrics": {
      "fontSizeScale": 1.0,
      "fontWeightScale": 1,
      "typeSizeRatio": 1.2
    }
  }'
```

**Response:**
```json
{
  "fontName": "Inter",
  "category": "body",
  "currentMetrics": {
    "fontSizeScale": 0.97,
    "fontWeightScale": 1,
    "typeSizeRatio": 1.2
  },
  "proposedMetrics": {
    "fontSizeScale": 1.0,
    "fontWeightScale": 1,
    "typeSizeRatio": 1.2
  },
  "changes": {
    "fontSizeScale": {
      "from": 0.97,
      "to": 1.0
    }
  }
}
```

---

## Available Metrics

The following metrics can be queried and adjusted:

### Core Configuration Metrics
- **fontSizeScale** - Scale factor for font size (e.g., 0.97 = 3% smaller)
- **fontWeightScale** - Scale factor for font weight (e.g., 1.05 = 5% bolder)
- **typeSizeRatio** - Type scale ratio between heading levels (e.g., 1.2 = 20% size increase per level)

### Body-Specific Metrics
- **bodyFontSizeScale** - Font size scaling for body text
- **bodyFontWeightScale** - Font weight scaling for body text
- **bodyLetterSpacingScale** - Letter spacing for body text
- **bodyLineHeight** - Line height for body text
- **bodyTypeSizeRatio** - Type scale ratio for body

### Header-Specific Metrics
- **headerFontWeightScale** - Font weight scaling for headers
- **headerLetterSpacingScale** - Letter spacing for headers
- **headerLineHeight** - Line height for headers
- **headerTypeSizeRatio** - Type scale ratio for headers

### Measured Glyph Metrics (calculated on typography page)
- **capHeight** - Cap height ratio to font size
- **xHeight** - X-height ratio to font size
- **ascender** - Ascender height ratio
- **descender** - Descender depth ratio
- **stem** - Stem width ratio
- **bowlCounter** - Bowl/counter width ratio

### Spacing Overrides
- **tracking** - Letter spacing override (in em units)
- **leading** - Line height override
- **pointSize** - Measurement point size (in pixels)

---

## Agent Workflow

### Step 1: Get Karla's Baseline
```bash
curl "http://localhost:3000/api/dev/typography/karla?category=body"
```

Store Karla's metrics as the target reference:
- fontSizeScale: 1
- fontWeightScale: 1
- typeSizeRatio: 1.2

### Step 2: List Available Fonts
```bash
curl "http://localhost:3000/api/dev/typography/fonts?category=body"
```

Identify which fonts need alignment (any that differ from Karla).

### Step 3: Compare Target Font
```bash
curl "http://localhost:3000/api/dev/typography/compare?targetFont=Inter&threshold=0.05"
```

Review the comparison results:
- Metrics with `delta: 0` are already aligned ✓
- Metrics with non-zero `delta` need adjustment
- Use the `suggestions` array to see priority adjustments

### Step 4: Preview Adjustments
```bash
curl -X POST http://localhost:3000/api/dev/typography/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "fontName": "Inter",
    "category": "body",
    "metrics": {
      "fontSizeScale": 1.0
    }
  }'
```

Verify the `changes` object shows only the metrics you modified.

### Step 5: Test & Iterate
Once you're satisfied with the proposed metrics:
1. Update the metrics in `font-config.ts` 
2. Run the dev server and visually test the typography page
3. Use the comparison endpoint again to verify alignment
4. Repeat steps 3-4 until all metrics align (within threshold)

### Step 6: Validate Alignment
```bash
curl "http://localhost:3000/api/dev/typography/compare?targetFont=Inter&threshold=0.01"
```

With threshold set very low (0.01 = 1%), this shows any remaining differences > 1%.

---

## Example: Aligning Inter to Karla

**Initial comparison:**
```bash
curl "http://localhost:3000/api/dev/typography/compare?targetFont=Inter&referenceFont=Karla"
```

Results show:
- fontSizeScale: Inter=0.97, Karla=1 (delta: -3%) ❌
- fontWeightScale: Inter=1, Karla=1 (delta: 0%) ✓
- typeSizeRatio: Inter=1.2, Karla=1.2 (delta: 0%) ✓
- bodyLetterSpacingScale: Inter=0.2, Karla=undefined ❌

**Proposed adjustment:**
```bash
curl -X POST http://localhost:3000/api/dev/typography/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "fontName": "Inter",
    "category": "body",
    "metrics": {
      "fontSizeScale": 1.0,
      "bodyLetterSpacingScale": 0
    }
  }'
```

**Update font-config.ts:**
```typescript
{
  name: "Inter",
  family: '"Inter Variable", system-ui, sans-serif',
  category: "body",
  isDefault: false,
  metrics: {
    fontSizeScale: 1.0,        // Changed from 0.97
    fontWeightScale: 1,
    typeSizeRatio: 1.2,
    headerLetterSpacingScale: -1.2,
    bodyLetterSpacingScale: 0,  // Changed from 0.2
    bodyFontSizeScale: 0.995
  },
}
```

**Verify alignment:**
```bash
curl "http://localhost:3000/api/dev/typography/compare?targetFont=Inter&referenceFont=Karla&threshold=0.01"
```

Now check if all metrics with significant impact are aligned!

---

## Error Handling

### 400 Bad Request
Missing required parameters or invalid request body.

```json
{
  "error": "Missing required parameter: fontName"
}
```

### 404 Not Found
Font or category doesn't exist.

```json
{
  "error": "Font \"InvalidFont\" not found in category \"body\""
}
```

---

## Notes for Agents

1. **Non-persistent changes**: The `/adjust` endpoint only previews changes; it doesn't modify `font-config.ts`. Manual updates are required.

2. **Measured metrics**: Fields like `capHeight`, `xHeight`, `ascender`, `descender` are calculated on the typography playground page using Canvas API. These fields may be empty (`undefined`) until measured on the page.

3. **Default threshold**: Use `threshold=0.05` (5%) for general alignment. Use `threshold=0.01` (1%) for precision alignment.

4. **Category support**: All endpoints support `body`, `header`, and `mono` categories independently. Fonts can have different metrics per category.

5. **Validation**: The API validates that proposed metrics are numeric and properly typed but doesn't enforce business logic constraints (e.g., fontWeightScale > 0).

---

## See Also

- **Typography Playground**: `/app/dev/typography` - Visual testing and metric measurement
- **Font Config**: `src/features/theme/constants/font-config.ts` - Font definitions and metrics storage
- **Metrics Library**: `src/features/theme/lib/metrics-api.ts` - Core logic for metric comparison and suggestions
