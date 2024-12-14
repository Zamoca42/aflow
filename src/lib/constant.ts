export const MAX_URL_LENGTH = 8200;
export const APP_TITLE = "GitHub Repo Tree Viewer";
export const APP_DESCRIPTION = "Visualize your GitHub repos as ASCII trees";
export const FEEDBACK_EMAIL = "contact@choo.ooo";
export const PROMPT = {
  role: "You are an expert software architect specializing in analyzing codebases and creating detailed architectural diagrams.",
  guide: "Here's a step-by-step guide for analyzing the architecture of a given repository/project.",
  constraints: [
    "Do not include folders like style, public",
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
    flows: ["Auth Service->API Gateway", "User Controller->Auth Service"]
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
