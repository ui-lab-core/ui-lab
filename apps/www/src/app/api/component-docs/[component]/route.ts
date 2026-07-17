import { NextResponse } from 'next/server';
import { generatedAPI, generatedStyles } from 'ui-lab-registry';

export function GET(request: Request, { params }: { params: Promise<{ component: string }> }) {
  return resolve(request, params);
}

async function resolve(request: Request, params: Promise<{ component: string }>) {
  const { component } = await params;
  const tab = new URL(request.url).searchParams.get('tab');
  const styles = generatedStyles[component] ?? null;

  if (tab === 'api') {
    return NextResponse.json({
      api: generatedAPI[component] ?? null,
      parts: styles?.styleableParts ?? [],
    });
  }

  if (tab === 'styles') return NextResponse.json({ styles });
  return NextResponse.json({ error: 'Unknown documentation tab' }, { status: 400 });
}
