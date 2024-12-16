"use server";

import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ArchitectureSchema } from "@/lib/schema";
import { PROMPT } from "@/lib/constant";

const TIMEOUT = 60000;

export async function getArchitecture(input: string) {
  "use server";

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    maxRetries: 3,
    temperature: 1.0,
    cache: true,
    callbacks: [
      {
        handleLLMEnd: async (output) => {
          console.log(JSON.stringify(output, null, 2));
          console.log("API Call End");
        },
      },
    ],
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const architecture = await model.pipe(parser).invoke(formattedPrompt, {
      timeout: TIMEOUT,
      signal: controller.signal,
    });

    return { architecture };
  } catch (error) {
    if (error instanceof Error && error.message === "Aborted") {
      throw new Error("Request timed out after 60 seconds");
    }
    console.error("Error during AI visualization:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
