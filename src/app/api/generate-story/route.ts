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
    { role: 'system', content: `You are an AI that generates a story based on the user's description and previous parts.` },
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

  const response = await client.chat({
    model: 'mistral-small-latest',
    messages: messages,
  });

  const { storyContent, options } = extractOptionsFromContent(response.choices[0].message.content);
  const wordCount = storyContent.split(' ').length;

  return NextResponse.json({ content: storyContent, options, wordCount });
}

function extractOptionsFromContent(content: string): { storyContent: string, options: string[] } {
  const options: string[] = [];
  const contentWithoutOptions = content.replace(/Option \d: .*\n?/g, (match) => {
    options.push(match.replace(/Option \d: /, '').trim());
    return '';
  }).trim();

  return { storyContent: contentWithoutOptions, options };
}
