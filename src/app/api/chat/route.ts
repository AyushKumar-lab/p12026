import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI chat is not configured. Add ANTHROPIC_API_KEY to .env' },
        { status: 503 }
      );
    }

    const { message, context } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are LocIntel AI, a business location intelligence assistant for Indian MSMEs.
You help entrepreneurs evaluate whether a location is good for their business.

Current analysis context:
- Location: ${context?.locationName || 'Unknown'}
- Overall Score: ${context?.overallScore || 'N/A'}/100
- Top Places: ${context?.topPlaces?.map((p: any) => `#${p.rank} ${p.score}/100`).join(', ') || 'None'}
- Business Type: ${context?.businessType || 'General'}
- City: ${context?.city || 'Unknown'}

Rules:
1. Be concise — max 3-4 sentences per response
2. Reference the actual score and data when answering
3. Be honest about limitations — mention "verify on ground before signing a lease"
4. Use ₹ for currency, mention India-specific factors (festivals, monsoon, autos)
5. If score > 70: optimistic but mention risks. If < 45: warn clearly. 45-70: balanced view.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: message.slice(0, 500) }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[LocIntel Chat] Anthropic error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[LocIntel Chat] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
