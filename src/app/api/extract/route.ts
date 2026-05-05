import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { auditTransformer } from '@/lib/audit';
import { TransformerSpecs } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { pdfBase64, loadKva = 45 } = await req.json();

    if (!pdfBase64) {
      return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              type: 'text',
              text: `Extract the following transformer specifications from this datasheet. 
              Return ONLY a JSON object with these keys:
              - kva (number)
              - primaryVoltage (number)
              - secondaryVoltage (number)
              - phase (number, either 1 or 3)
              - impedance (number, percentage value like 5.75)
              - windingMaterial (string, 'Copper' or 'Aluminum')
              
              If a value is not found, use a reasonable industrial default or null.`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const specs: TransformerSpecs = JSON.parse(content.text);
    
    // Run deterministic audit
    const auditResult = auditTransformer(specs, loadKva);

    return NextResponse.json({ specs, auditResult });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
