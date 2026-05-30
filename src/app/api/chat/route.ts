import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    // Fetch all colleges from the database to give context to Gemini
    const allColleges = await prisma.college.findMany({
      select: { name: true, rating: true, fees: true, highestPackage: true, avgPackage: true, location: true }
    });

    const collegesContext = allColleges.map(c => 
      `- ${c.name} (Location: ${c.location}, Fees: ₹${c.fees}, Rating: ${c.rating}, Avg Pkg: ${c.avgPackage}, Highest Pkg: ${c.highestPackage})`
    ).join('\n');

    const systemPrompt = `You are a helpful college discovery assistant for the platform "Pathway". 
You help students choose the right engineering college in India. 
Here is the current list of colleges in our database with their stats:
${collegesContext}

Keep your responses concise, friendly, and helpful. Do not mention that you are an AI unless explicitly asked. Always base your recommendations on the provided list of colleges. Format your response clearly using markdown.`;

    // Construct history for the model
    const userMessage = messages[messages.length - 1].content;
    const previousMessages = messages.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    
    const prompt = `${systemPrompt}\n\nChat History:\n${previousMessages}\n\nUser: ${userMessage}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 });
  }
}
