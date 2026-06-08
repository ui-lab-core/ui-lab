import { NextResponse } from "next/server";

export function GET() {
  const docs = {
    title: "Typography Metrics API",
    description:
      "Query and adjust typography metrics for UI fonts to align them with Karla baseline",
    baseUrl: "/api/dev/typography",
    endpoints: {
      docs: {
        path: "/docs",
        method: "GET",
        description: "Get API documentation (this endpoint)",
      },
      karla: {
        path: "/karla",
        method: "GET",
        description: "Get Karla baseline metrics (reference font)",
        queryParams: {
          category: {
            type: "string",
            enum: ["body", "header", "mono"],
            default: "body",
          },
        },
        example: "/karla?category=body",
        response: {
          name: "string",
          family: "string",
          category: "string",
          metrics: "object",
        },
      },
      metrics: {
        path: "/metrics",
        method: "GET",
        description: "Get metrics for a specific font",
        queryParams: {
          fontName: {
            type: "string",
            required: true,
            description: "Font name (e.g., Karla, Inter, Geist Sans, Work Sans)",
          },
          category: {
            type: "string",
            enum: ["body", "header", "mono"],
            default: "body",
          },
        },
        example: "/metrics?fontName=Inter&category=body",
        response: {
          name: "string",
          family: "string",
          category: "string",
          metrics: "object",
        },
      },
      fonts: {
        path: "/fonts",
        method: "GET",
        description: "List all available fonts in a category with their metrics",
        queryParams: {
          category: {
            type: "string",
            enum: ["body", "header", "mono"],
            default: "body",
          },
        },
        example: "/fonts?category=body",
        response: {
          category: "string",
          count: "number",
          fonts: "array of font metrics",
        },
      },
      compare: {
        path: "/compare",
        method: "GET",
        description: "Compare a target font against a reference font (default: Karla)",
        queryParams: {
          targetFont: {
            type: "string",
            required: true,
            description: "Font to analyze",
          },
          referenceFont: {
            type: "string",
            default: "Karla",
            description: "Font to compare against",
          },
          category: {
            type: "string",
            enum: ["body", "header", "mono"],
            default: "body",
          },
          threshold: {
            type: "number",
            default: 0.05,
            description: "Percentage threshold for suggesting adjustments (0-1)",
          },
          suggestions: {
            type: "boolean",
            default: true,
            description: "Include adjustment suggestions in response",
          },
        },
        example: "/compare?targetFont=Inter&referenceFont=Karla&suggestions=true",
        response: {
          comparison: {
            targetFont: "string",
            referenceFont: "string",
            metrics: "object with delta values",
          },
          suggestions: "array of adjustment suggestions",
        },
      },
      adjust: {
        path: "/adjust",
        method: "POST",
        description: "Compute proposed metric adjustments for a font",
        body: {
          fontName: "string (required)",
          category: "string (required, enum: body|header|mono)",
          metrics: "object of metric adjustments to propose",
        },
        example: {
          fontName: "Inter",
          category: "body",
          metrics: {
            fontSizeScale: 0.97,
            fontWeightScale: 1,
          },
        },
        response: {
          fontName: "string",
          category: "string",
          currentMetrics: "object",
          proposedMetrics: "object",
          changes: "object tracking what changed",
        },
      },
    },
    availableFonts: {
      body: ["Karla", "Geist Sans", "Inter", "Work Sans"],
      header: ["Karla", "Geist Sans", "Inter", "Work Sans"],
      mono: ["Ioskeley Mono", "JetBrains Mono"],
    },
    metricFields: {
      description: "Metrics that can be measured and adjusted",
      fields: {
        fontSizeScale: "Scale factor for font size (e.g., 0.97)",
        fontWeightScale: "Scale factor for font weight (e.g., 1)",
        typeSizeRatio: "Type scale ratio between sizes (e.g., 1.2)",
        bodyTypeSizeRatio: "Body-specific type scale ratio",
        headerTypeSizeRatio: "Header-specific type scale ratio",
        bodyFontSizeScale: "Body-specific font size scale",
        bodyFontWeightScale: "Body-specific font weight scale",
        headerFontWeightScale: "Header-specific font weight scale",
        bodyLetterSpacingScale: "Body-specific letter spacing scale",
        headerLetterSpacingScale: "Header-specific letter spacing scale",
        bodyLineHeight: "Body-specific line height",
        headerLineHeight: "Header-specific line height",
        capHeight: "Cap height ratio (measured)",
        xHeight: "X-height ratio (measured)",
        ascender: "Ascender height ratio (measured)",
        descender: "Descender depth ratio (measured)",
        stem: "Stem width ratio (measured)",
        bowlCounter: "Bowl/counter width ratio (measured)",
        tracking: "Letter spacing override (in em)",
        leading: "Line height override",
        pointSize: "Measurement point size in pixels",
        alignment: "Text alignment (left|center|right|justify)",
      },
    },
    workflowExample: {
      title: "Agent Workflow for Aligning Fonts to Karla",
      steps: [
        "GET /karla?category=body to get Karla's baseline metrics",
        "GET /fonts?category=body to list all available fonts",
        "GET /compare?targetFont=Inter&referenceFont=Karla to identify differences",
        "Review the 'suggestions' array to see which metrics need adjustment",
        "POST /adjust with proposed metric changes to preview alignment",
        "Repeat steps 3-4 until metrics align within acceptable threshold",
      ],
    },
  };

  return NextResponse.json(docs);
}
