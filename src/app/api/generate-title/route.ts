import { NextResponse } from 'next/server';
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: `Generate a title for the following description: ${description}` }],
    });

    let title = chatResponse.choices[0].message.content.trim();
    title = title.replace(/^"|"$/g, ''); // Remove quotes from the beginning and end

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Error generating title:", error);
    return new NextResponse('Failed to generate title', { status: 500 });
  }
}
