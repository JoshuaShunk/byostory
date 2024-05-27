import { NextResponse } from 'next/server';
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function POST(request: Request) {
  const { description, part, totalParts, currentStory, path } = await request.json();

  const messages: Message[] = [
    { role: 'system', content: `You are an AI that generates a story based on the user's description and previous parts. Do not create a title just start the story.` },
    { role: 'user', content: `Description: ${description}` },
    { role: 'assistant', content: `Current story: ${currentStory}` },
    { 
      role: 'user', 
      content: `This is part ${part} of ${totalParts}. Continue the story based on the chosen path: ${path}. Ensure it is around 500 words. ${
        part === totalParts 
        ? 'This is the final part of the story, do not provide further options.'
        : 'Provide exactly two options for the next part at the end in the following format:\nOption 1: [Text]\nOption 2: [Text].'
      }` 
    },
  ];

  const chatStreamResponse = await client.chatStream({
    model: 'mistral-small-latest',
    messages: messages,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of chatStreamResponse) {
        if (chunk.choices[0].delta.content !== undefined) {
          const streamText = chunk.choices[0].delta.content;
          controller.enqueue(encoder.encode(streamText));
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
