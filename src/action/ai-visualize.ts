"use server";

import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Architecture, ArchitectureSchema } from "@/lib/schema";
import { UpstashRedisCache } from "@/lib/upstash-redis";
import { UpstashRatelimitHandler } from "@langchain/community/callbacks/handlers/upstash_ratelimit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CACHE_HOURS, PROMPT, RATE_LIMIT_DURATION, RATE_LIMIT_TOKEN } from "@/lib/constant";
import { auth } from "@/action/auth";
// import { ChatAnthropic } from "@langchain/anthropic";

const TIMEOUT = 60000;

const CACHE_TTL = CACHE_HOURS * 60 * 60;
const DEV_CACHE_TTL = 60 * 5;

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const requestRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(RATE_LIMIT_TOKEN, `${RATE_LIMIT_DURATION} s`),
});

export async function getArchitecture(input: string): Promise<{
  architecture: Architecture | null;
  isCached: boolean;
  success: boolean;
}> {
  "use server";

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

  const cache = new UpstashRedisCache({
    client: redis,
    ttl: process.env.NODE_ENV === "production" ? CACHE_TTL : DEV_CACHE_TTL,
  });

  const session = await auth();
  const userId = session?.user?.username;

  if (!userId) {
    return { architecture: null, isCached: false, success: false };
  }

  const ratelimitHandler = new UpstashRatelimitHandler(userId, {
    requestRatelimit,
  });

  let isCached = false;
  const { success } = await requestRatelimit.limit(userId);

  if (!success) {
    return { architecture: null, isCached, success };
  } else {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT);

    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        maxRetries: 3,
        temperature: 1.0,
        cache,
        streaming: true,
        streamUsage: true,
        callbacks: [ratelimitHandler],
      });

      // const model = new ChatAnthropic({
      //   model: "claude-3-5-sonnet-20240620",
      //   maxRetries: 3,
      //   temperature: 1.0,
      //   cache,
      //   streaming: true,
      //   streamUsage: true,
      //   callbacks: [ratelimitHandler],
      // });

      const architecture = await model.pipe(parser).invoke(formattedPrompt, {
        timeout: TIMEOUT,
        signal: abortController.signal,
        callbacks: [
          {
            handleLLMEnd: (output) => {
              isCached = !output.llmOutput;
            },
          },
        ],
      });

      return { architecture, isCached, success };
    } catch (error) {
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
