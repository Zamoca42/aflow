export const GITHUB_APP_NAME = "adotflow";
export const APP_TITLE = "A.flow";
export const APP_URL = "https://www.aflow.dev";
export const CACHE_HOURS = 12;
export const RATE_LIMIT_TOKEN = 3;
export const RATE_LIMIT_DURATION = 90;
export const APP_DESCRIPTION = "A tool for visualizing the directory structure of GitHub repositories as ASCII trees and generating architecture diagrams powered by AI, enabling quick understanding and efficient sharing of codebases.";
export const PROMPT = {
  role: "You are an expert software architect specializing in analyzing codebases and creating detailed architectural diagrams.",
  guide: "Here's a step-by-step guide for analyzing the architecture of a given repository/project.",
  constraints: [
    "Do not include folders like style, public, UI, packages",
    "No brackets allowed in any text",
    "Component IDs must be unique",
    "flows should focus on minor component dependencies",
    "Use file structure as reference only, do not structure based on files"
  ],
  guidelines: [
    "Analyze the provided repository/project structure",
    "Identify logical groupings and patterns in the codebase",
    "Infer architectural layers from the code organization",
    "Understand component relationships and dependencies",
    "Focus on high-level architectural patterns"
  ],
  rules: {
    title: "Provide a clear, descriptive project/architecture name",
    nodes: "Infer main architectural layers from the codebase",
    items: "Use brief, diagram-friendly component names (2-3 words maximum)",
    flows: "Document dependencies using the exact component names from items array"
  },
  examples: {
    components: ["Auth Service", "API Gateway", "User Controller"],
    flows: ["source: 'Auth Service', target: 'API Gateway'", "source: 'User Controller', target: 'Auth Service'"]
  },
  schemaDescription: {
    title: "The title of the architecture",
    nodes: {
      title: "The title of the layer",
      items: "Array of component names within this layer",
      description: "Array of architectural layers"
    },
    flows: "Array of dependencies between components"
  },
  important: "Respond ONLY with a JSON object. Do not include any explanations, notes, or additional text before or after the JSON."
} as const;
export const EXAMPLE_MERMAID_CODE = `flowchart TD
  subgraph Frontend["Frontend"]
    AppLayout["App Layout"]
    RepositoryPage["Repository Page"]
    Sidebar["Sidebar"]
    UIComponents["UI Components"]
  end

  subgraph Backend["Backend"]
    APIRoutes["API Routes"]
    Authentication["Authentication"]
    GitHubIntegration["GitHub Integration"]
  end

  subgraph CoreServices["Core Services"]
    AIVisualizer["AI Visualizer"]
    MarkdownParser["Markdown Parser"]
    TreeGenerator["Tree Generator"]
  end

  subgraph DataLayer["Data Layer"]
    RedisCache["Redis Cache"]
    GitHubAPI["GitHub API"]
  end

  RepositoryPage --> CoreServices
  GitHubIntegration --> GitHubAPI
  GitHubAPI --> RepositoryPage
  APIRoutes --> Authentication
  AIVisualizer --> RedisCache
  TreeGenerator --> MarkdownParser
  Sidebar --> GitHubIntegration
  AppLayout --> UIComponents
  `;
