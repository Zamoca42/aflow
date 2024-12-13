
'use server';

import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ArchitectureSchema } from "@/lib/schema";
import { PROMPT } from "@/lib/constant";

export async function getArchitecture(input: string) {
  'use server';

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 1.0,
    apiKey: process.env.GOOGLE_API_KEY,
    maxRetries: 2,
  });

  const parser = StructuredOutputParser.fromZodSchema(ArchitectureSchema);
  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `${PROMPT.role}
    ${PROMPT.guide}

0. Constraints: 
${PROMPT.constraints.map(c => `- ${c}`).join('\n')}

1. Analysis Guidelines:
${PROMPT.guidelines.map(g => `- ${g}`).join('\n')}

2. Structuring Rules:
- title: ${PROMPT.rules.title}
- nodes: ${PROMPT.rules.nodes}
- items: ${PROMPT.rules.items}
  Example: ${PROMPT.examples.components.join(', ')}
- flows: ${PROMPT.rules.flows}
  Example: ${PROMPT.examples.flows.join(', ')}

Project Description:
{input}

Format Instructions:
{format_instructions}

IMPORTANT: ${PROMPT.important}
`,
    inputVariables: ["input", "format_instructions"],
  });

  const formattedPrompt = await prompt.format({
    input,
    format_instructions: formatInstructions,
  });

  try {
    const architecture = await model.pipe(parser).invoke(formattedPrompt, {
      timeout: 60000,
    });
    return { architecture };
  } catch (error) {
    console.error("Error during AI visualization:", error);
    throw error;
  }
}
