"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/features/theme/lib/app-context";
import { generateThemeSetupFiles } from "@/features/theme/config";
import { computeStyleVariables } from "@/features/theme/lib/css-variable-generator";
import type { TypographyConfig } from "@/features/theme/lib/typography-config";
import { Code } from "@/features/docs/components/code-display/code";
import { SettingsSidebar } from "@/features/theme/components/settings-sidebar";
import {
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  Checkbox,
  Date as Calendar,
  Divider,
  Expand,
  Flex,
  Grid,
  Input,
  Label,
  List,
  Menu,
  Modal,
  Page,
  Progress,
  Radio,
  Select,
  Slider,
  Switch,
  Table,
  Tabs,
  TextArea,
  Scroll,
} from "ui-lab-components";
import {
  Download,
  Megaphone,
  MoreHorizontal,
  PlugZap,
  Search,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { SiGithub } from "@/shared/icons/si";

const SETUP_INSTALL = `pnpm add ui-lab-components ui-lab-theme-onyx`;

function ExampleCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Card variant="secondary" className="border-background-700/80">
      <CardBody className="flex min-h-0 flex-1 flex-col gap-4 p-4">{children}</CardBody>
    </Card>
  );
}

function PreviewCanvas() {
  const { currentThemeColors } = useApp();

  if (!currentThemeColors) return null;

  const apiRows = [
    { endpoint: "POST /v1/messages", p95: "128 ms", status: "Healthy" },
    { endpoint: "GET /v1/projects", p95: "86 ms", status: "Healthy" },
    { endpoint: "POST /v1/exports", p95: "412 ms", status: "Spike" },
  ];

  const apiColumns = [
    { key: "endpoint" as const, label: "Endpoint" },
    { key: "p95" as const, label: "p95" },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => <Badge variant={value === "Spike" ? "warning" : "success"}>{value}</Badge>,
    },
  ];

  const webhookRows = [
    { event: "checkout.created", destination: "Stripe", status: "Live" },
    { event: "lead.created", destination: "Loops", status: "Live" },
    { event: "user.deleted", destination: "Audit log", status: "Paused" },
  ];

  const webhookColumns = [
    { key: "event" as const, label: "Event" },
    { key: "destination" as const, label: "Destination" },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => <Badge variant={value === "Paused" ? "warning" : "success"}>{value}</Badge>,
    },
  ];

  return (
    <Grid className="p-4" columns={{ sm: 1, md: 2, xl: 3 }} rows="masonry" align-start gap="md">
      <ExampleCard>
        <Flex direction="column" className="gap-3">
          <Input placeholder="you@example.com" icon={<SiGithub size={14} />} />
          <Input placeholder="Password" type="password" />
          <Button className="justify-center">Get started</Button>
        </Flex>
      </ExampleCard>

      <ExampleCard>
        <Flex className="flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost" icon={<MoreHorizontal size={14} />} aria-label="More options" />
        </Flex>
      </ExampleCard>

      <ExampleCard>
        <Banner variant="success">
          <Banner.Title>Ready to ship</Banner.Title>
          <Banner.Body>All required steps are complete.</Banner.Body>
        </Banner>
      </ExampleCard>

      <ExampleCard>
        <Progress value={66} label="Launch checklist" showValue />
      </ExampleCard>

      <ExampleCard>
        <Flex direction="column" className="gap-3">
          <Checkbox checked label="Connect domain" />
          <Checkbox label="Invite team" />
          <Switch checked aria-label="Notifications" />
        </Flex>
      </ExampleCard>

      <ExampleCard>
        <Radio.Group value="annual" label="Billing">
          <Radio.Item value="monthly" label="Monthly" />
          <Radio.Item value="annual" label="Annual" />
        </Radio.Group>
      </ExampleCard>

      <ExampleCard>
        <Select value="pro" label="Pro">
          <Select.Trigger>
            <Select.Value placeholder="Plan" />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="starter">Starter</Select.Item>
              <Select.Item value="pro">Pro</Select.Item>
              <Select.Item value="enterprise">Enterprise</Select.Item>
            </Select.List>
          </Select.Content>
        </Select>
      </ExampleCard>

      <ExampleCard>
        <Slider value={64} aria-label="Review threshold" />
      </ExampleCard>

      <ExampleCard>
        <Tabs default="rollout">
          <Tabs.List>
            <Tabs.Trigger value="rollout">Rollout</Tabs.Trigger>
            <Tabs.Trigger value="segments">Segments</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="rollout">
            <Progress value={42} label="Coverage" showValue />
          </Tabs.Content>
          <Tabs.Content value="segments">
            <List gap="xs">
              <List.Item value="free">
                <Flex align-center justify-between className="w-full gap-3">
                  <List.Title>Free tier</List.Title>
                  <Switch aria-label="Free tier" />
                </Flex>
              </List.Item>
            </List>
          </Tabs.Content>
        </Tabs>
      </ExampleCard>

      <ExampleCard>
        <Table data={apiRows} columns={apiColumns} />
      </ExampleCard>

      <ExampleCard>
        <Input placeholder="Search feedback" icon={<Search size={14} />} />
      </ExampleCard>

      <ExampleCard>
        <List gap="xs">
          <List.Item value="slack">
            <List.Media>
              <Megaphone size={16} />
            </List.Media>
            <div className="min-w-0">
              <List.Title>Integrations</List.Title>
              <List.Desc>Most requested</List.Desc>
            </div>
            <Badge variant="success">Ship</Badge>
          </List.Item>
          <List.Item value="sso">
            <List.Media>
              <ShieldCheck size={16} />
            </List.Media>
            <div className="min-w-0">
              <List.Title>Enterprise auth</List.Title>
              <List.Desc>Blocking deals</List.Desc>
            </div>
            <Badge variant="warning">Later</Badge>
          </List.Item>
        </List>
      </ExampleCard>

      <ExampleCard>
        <TextArea
          placeholder="What's new in this release?"
          maxCharacters={120}
          maxHeight="5rem"
        />
      </ExampleCard>

      <ExampleCard>
        <Flex direction="column" className="gap-3">
          <Input value="sarah@startup.dev" readOnly icon={<UserPlus size={14} />} />
          <Button icon={<Send size={14} />} className="justify-center">
            Send invite
          </Button>
        </Flex>
      </ExampleCard>

      <ExampleCard>
        <Menu type="pop-over">
          <Menu.Trigger>
            <Button variant="ghost" icon={<MoreHorizontal size={14} />}>
              Actions
            </Button>
          </Menu.Trigger>
          <Menu.Content side="bottom">
            <Menu.Item>Edit role</Menu.Item>
            <Menu.Item>Remove</Menu.Item>
          </Menu.Content>
        </Menu>
      </ExampleCard>

      <ExampleCard>
        <Expand title="Advanced settings" expanded>
          <Flex direction="column" className="gap-3 p-3">
            <Checkbox checked label="Notify voters" />
            <Checkbox label="Create Linear task" />
          </Flex>
        </Expand>
      </ExampleCard>

      <ExampleCard>
        <Flex className="flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge icon={<PlugZap size={12} />}>Live</Badge>
        </Flex>
      </ExampleCard>

      <ExampleCard>
        <Calendar value={new globalThis.Date(2026, 4, 19)} defaultMonth={new globalThis.Date(2026, 4, 1)} />
      </ExampleCard>

      <ExampleCard>
        <Table data={webhookRows} columns={webhookColumns} />
      </ExampleCard>

      <ExampleCard>
        <Flex direction="column" className="gap-2">
          <Button variant="ghost" className="justify-start">Before divider</Button>
          <Divider />
          <Button variant="ghost" className="justify-start">After divider</Button>
        </Flex>
      </ExampleCard>
    </Grid>
  );
}

function TypographyCanvas() {
  return (
    <div className="flex w-full justify-center">
      <article className="typography w-(--content-width) max-w-full p-6 sm:p-10">
        <p className="text-sm text-foreground-400">Design notes · 6 min read</p>
        <h1>A quieter way to make a product feel clear</h1>
        <p>
          A good interface makes room for people to think. It uses <strong>clear hierarchy</strong>,
          comfortable line lengths, and just enough contrast to direct attention without demanding it.
        </p>

        <figure>
          <div
            role="img"
            aria-label="Placeholder for a product design image"
            className="grid place-items-center overflow-hidden rounded-md border border-background-700 bg-background-800"
          >
            <div className="grid h-[20rem] w-2/3 grid-cols-3 gap-3 opacity-70">
            </div>
          </div>
        </figure>

        <h2>Start with the reading rhythm</h2>
        <p>
          Body copy should feel steady. Use <em>italics</em> for a gentle change in tone, inline
          <code> code </code> for implementation details, and links only when they help someone move
          forward.
        </p>
        <blockquote>
          Typography is the interface between the words and the reader.
        </blockquote>

        <h3>Three useful defaults</h3>
        <ul>
          <li>Use headings to create a visible outline.</li>
          <li>Keep paragraphs focused on one idea.</li>
          <li>Let supporting text stay quieter than primary content.</li>
        </ul>
        <ol>
          <li>Choose a body face built for extended reading.</li>
          <li>Pair it with a distinct, expressive heading face.</li>
          <li>Reserve mono type for code, values, and technical detail.</li>
        </ol>

        <h2>Let the details support the message</h2>
        <p>
          These settings are applied to every example here, so changes in the configuration panel
          immediately show how the system behaves in a realistic document.
        </p>
        <pre><code>{`export const article = {
  rhythm: "comfortable",
  hierarchy: "clear",
};`}</code></pre>
      </article>
    </div>
  );
}

function SetupStep({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label size="sm" className="font-semibold text-foreground-200">
          {step}. {title}
        </Label>
        {description ? (
          <div className="text-sm text-foreground-400">{description}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function InitializeContent({
  themeCss,
  typographyCss,
  globalsCss,
  layoutTsx,
  themeToggleTsx,
  bundleSizeLabel,
  onDownload,
}: {
  themeCss: string;
  typographyCss: string;
  globalsCss: string;
  layoutTsx: string;
  themeToggleTsx: string;
  bundleSizeLabel: string;
  onDownload: () => void;
}) {
  return (
    <Flex direction="column" className="gap-6">
      <Flex align-start justify-between className="gap-3">
        <div className="text-sm text-foreground-400">
          Everything below is generated from your current configuration.
          UI Lab components ship without design tokens, so they look unstyled
          until a theme is loaded. ui-lab-theme-onyx supplies that base theme;
          the generated theme.css layers your configured tokens on top of it.
          Three steps gets a project running · {bundleSizeLabel}
        </div>

        <Button
          onPress={onDownload}
          variant="secondary"
          className="shrink-0"
          icon={<Download size={12} />}
        >
          Download all
        </Button>
      </Flex>

      <SetupStep
        step={1}
        title="Install the package and a base theme"
        description="ui-lab-theme-onyx is the base theme UI Lab components render against — install it alongside the components, then override its tokens with your own."
      >
        <Code language="bash" filename="terminal">
          {SETUP_INSTALL}
        </Code>
      </SetupStep>

      <SetupStep
        step={2}
        title="Add your theme"
        description="Create app/theme.css with your generated tokens, then replace app/globals.css. It imports ui-lab-theme-onyx first, so your tokens override its defaults. Tailwind v4 is required."
      >
        <Tabs default="theme">
          <Tabs.List>
            <Tabs.Trigger value="theme">theme.css</Tabs.Trigger>
            <Tabs.Trigger value="globals">globals.css</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="theme">
            <Code language="css" filename="app/theme.css">
              {themeCss}
            </Code>
          </Tabs.Content>
          <Tabs.Content value="globals">
            <Code language="css" filename="app/globals.css">
              {globalsCss}
            </Code>
          </Tabs.Content>
        </Tabs>
      </SetupStep>

      <SetupStep
        step={3}
        title="Stamp the color mode in your layout"
        description="Merge into your root layout. The server reads the ui-lab-theme cookie so light and dark render correctly on first paint."
      >
        <Code language="tsx" filename="app/layout.tsx">
          {layoutTsx}
        </Code>
      </SetupStep>

      <div className="space-y-2">
        <Label size="sm" className="font-semibold text-foreground-300">
          Optional
        </Label>

        <Expand title="Theme toggle" expanded={false}>
          <div className="space-y-3 p-4">
            <div className="text-sm text-foreground-400">
              A minimal light/dark switch built on the useColorMode hook. Drop it
              anywhere in your client tree, then restyle it however you like —
              swap the label for your own icons, move it into a menu, or call
              toggleThemeMode from any control you already have.
            </div>
            <Code language="tsx" filename="components/theme-toggle.tsx">
              {themeToggleTsx}
            </Code>
          </div>
        </Expand>

        <Expand title="Long-form typography" expanded={false}>
          <div className="space-y-3 p-4">
            <div className="text-sm text-foreground-400">
              Reading-surface styles for articles and rich text. Save as
              app/typography.css, import it after your theme in globals.css, and
              add the typography class to long-form containers — not the page
              root.
            </div>
            <Code language="tsx" filename="import">
              {`@import "./typography.css";`}
            </Code>
            <Code language="css" filename="app/typography.css">
              {typographyCss}
            </Code>
          </div>
        </Expand>
      </div>
    </Flex>
  );
}

export default function ConfigPage({
  baseTypographyCss,
}: {
  baseTypographyCss: string;
}) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [preview, setPreview] = useState("ui");
  const {
    currentThemeColors,
    currentThemeMode,
    headerFontWeightScale,
    bodyFontWeightScale,
    headerLetterSpacingScale,
    bodyLetterSpacingScale,
    headerLineHeight,
    bodyLineHeight,
    headerTypeSizeRatio,
    headerFontSizeScale,
    bodyTypeSizeRatio,
    bodyFontSizeScale,
    monoFontSizeScale,
    monoFontWeightScale,
    monoLetterSpacingScale,
    monoLineHeight,
    monoMinFontSizePx,
    bodyMinFontSizePx,
    headerMinFontSizePx,
    radius,
    borderWidth,
    spacingScale,
  } = useApp();

  useEffect(() => {
    document.body.dataset.configFullBleed = "true";

    return () => {
      delete document.body.dataset.configFullBleed;
    };
  }, []);

  const currentTypography: TypographyConfig = useMemo(
    () => ({
      headerTypeSizeRatio,
      headerFontSizeScale,
      headerFontWeightScale,
      headerLetterSpacingScale,
      headerLineHeight,
      headerMinFontSizePx,
      bodyTypeSizeRatio,
      bodyFontSizeScale,
      bodyFontWeightScale,
      bodyLetterSpacingScale,
      bodyLineHeight,
      bodyMinFontSizePx,
      monoFontSizeScale,
      monoFontWeightScale,
      monoLetterSpacingScale,
      monoLineHeight,
      monoMinFontSizePx,
    }),
    [
      headerTypeSizeRatio,
      headerFontSizeScale,
      headerFontWeightScale,
      headerLetterSpacingScale,
      headerLineHeight,
      headerMinFontSizePx,
      bodyTypeSizeRatio,
      bodyFontSizeScale,
      bodyFontWeightScale,
      bodyLetterSpacingScale,
      bodyLineHeight,
      bodyMinFontSizePx,
      monoFontSizeScale,
      monoFontWeightScale,
      monoLetterSpacingScale,
      monoLineHeight,
      monoMinFontSizePx,
    ],
  );

  // Typography and layout apply only inside the preview; the rest of
  // the site stays on the static baseline.
  const previewStyle = useMemo(() => {
    const vars = computeStyleVariables({
      typography: currentTypography,
      layout: { radius, borderWidth, spacingScale },
    });
    vars["--font-heading"] = vars["--font-header"];
    vars["--leading-heading"] = String(headerLineHeight);
    return vars as CSSProperties;
  }, [
    currentTypography,
    radius,
    borderWidth,
    spacingScale,
    headerLineHeight,
  ]);

  const typographyCss = baseTypographyCss;

  const themeSetup = useMemo(() => {
    if (!currentThemeColors) return null;

    return generateThemeSetupFiles(
      currentThemeColors,
      currentThemeMode,
      bodyTypeSizeRatio,
      bodyFontSizeScale,
      headerFontWeightScale,
      headerFontWeightScale,
      bodyFontWeightScale,
      headerLineHeight,
      bodyLineHeight,
      radius,
      borderWidth,
      spacingScale,
      undefined,
      {
        bodyMinFontSizePx,
        headerMinFontSizePx,
        headerTypeSizeRatio,
        headerFontSizeScale,
        monoFontSizeScale,
        monoFontWeightScale,
        monoLetterSpacingScale,
        monoLineHeight,
        monoMinFontSizePx,
      },
    );
  }, [
    currentThemeColors,
    currentThemeMode,
    bodyTypeSizeRatio,
    bodyFontSizeScale,
    headerTypeSizeRatio,
    headerFontSizeScale,
    monoFontSizeScale,
    monoFontWeightScale,
    monoLetterSpacingScale,
    monoLineHeight,
    monoMinFontSizePx,
    headerFontWeightScale,
    bodyFontWeightScale,
    headerLineHeight,
    bodyLineHeight,
    bodyMinFontSizePx,
    headerMinFontSizePx,
    radius,
    borderWidth,
    spacingScale,
  ]);

  const fullBundle = useMemo(() => {
    if (!themeSetup) return "";
    return `${themeSetup.fullBundle}\n\n/* === app/typography.css === */\n${typographyCss}`;
  }, [themeSetup, typographyCss]);

  const bundleSizeLabel = useMemo(() => {
    if (!fullBundle) return "0 KB";
    const kb = Math.max(1, Math.round(fullBundle.length / 1024));
    return `~${kb} KB`;
  }, [fullBundle]);

  const handleDownload = useCallback(() => {
    if (!fullBundle) return;
    const blob = new Blob([fullBundle], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ui-lab-theme-setup.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [fullBundle]);

  if (!currentThemeColors) {
    return (
      <div role="status" className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground-400">Loading configuration...</p>
      </div>
    );
  }

  return (
    <Page
      padding="none"
      maxWidth="none"
      centered={false}
      fullscreen
      className="bg-background-950 text-foreground-100 space-y-6"
    >
      <div className="grid w-full xl:grid-cols-[27rem_minmax(0,1fr)]">
        <SettingsSidebar
          footer={
            <Button
              onPress={() => setIsExportOpen(true)}
              variant="secondary"
              className="w-full justify-center"
              icon={<Download size={12} />}
            >
              Initialize project
            </Button>
          }
        />

        <section className="flex h-[calc(100vh-var(--header-height))] min-w-0 flex-col gap-3 p-4">
          <Tabs value={preview} onValueChange={setPreview} className="w-auto">
            <Tabs.List
              aria-label="Configuration previews"
              className="w-fit rounded-sm px-[5px]"
              styles={{ indicator: "rounded-sm bg-background-700" }}
            >
              <Tabs.Trigger
                value="components"
                className="rounded-full bg-transparent px-3 py-1 text-sm text-foreground-400 data-[selected=true]:text-foreground-100"
              >
                Components
              </Tabs.Trigger>
              <Tabs.Trigger
                value="typography"
                className="rounded-full bg-transparent px-3 py-1 text-sm text-foreground-400 data-[selected=true]:text-foreground-100"
              >
                Typography
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
          <Scroll maxHeight="100%" className="min-h-0 flex-1 rounded-sm border border-background-700" fade-y>
            <div style={previewStyle}>
              {preview === "components" ? <PreviewCanvas /> : <TypographyCanvas />}
            </div>
          </Scroll>
        </section>
      </div>
      <Modal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        title="Initialize project"
        className="max-w-[min(92vw,72rem)]"
        contentClassName="p-6"
      >
        <InitializeContent
          themeCss={themeSetup?.themeCss ?? ""}
          typographyCss={typographyCss}
          globalsCss={themeSetup?.globalsCss ?? ""}
          layoutTsx={themeSetup?.layoutTsx ?? ""}
          themeToggleTsx={themeSetup?.themeToggleTsx ?? ""}
          bundleSizeLabel={bundleSizeLabel}
          onDownload={handleDownload}
        />
      </Modal>
    </Page>
  );
}
