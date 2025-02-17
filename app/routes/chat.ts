import mistral from "../config/mistral.server";
import type { Route } from "./+types/chat";
import { z } from "zod";

const projectIdeaSchema = z.object({
  bandName: z.string(),
  description: z.string(),
  targetAudience: z.string(),
  songTitles: z.array(z.string()),
});

export type ProjectIdea = z.infer<typeof projectIdeaSchema>;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const response = await mistral.chat.parse({
    model: "mistral-small-latest",
    messages: [
      {
        role: "system" as const,
        content:
          "You are a music manager. Your goal is to generate a new band.\n\n" +
          "Technical Stack:\n" +
          "- Remix web framework\n" +
          "- MongoDB\n" +
          "- Mistral AI API\n\n" +
          "Time Constraint: 4 days\n\n" +
          "Available UI Components (from Figma):\n" +
          "- Onboarding flow\n" +
          "- Chatbot interface\n" +
          "- Detail pages and collections\n" +
          "- AI-powered content generation\n" +
          "- Social network features (Instagram-style)\n" +
          "- User dashboard\n\n" +
          "While these components are from a recipe app design, your suggestion should creatively adapt them to another domain. Focus on a feasible, engaging project that showcases the integration of AI with web technologies. Aim for a limited scope that only uses a subset of the UI Components, so there is time to polish the UI and UX.\n\n" +
          "Always reply with a single, concise project idea.\n\n" +
          "These ideas have already been generated, so do not suggest them:\n" +
          "- Travel planner\n" +
          "- Event planner\n" +
          "- Study Buddy\n" +
          "- Fitness tracker\n",
      },
      // If the user has already provided a message, include it in the message thread
      ...(message
        ? [
            {
              role: "assistant" as const,
              content:
                "Can you provide me with a band name, band concept and three songs?",
            },
            {
              role: "user" as const,
              content: message,
            },
          ]
        : []),
    ],
    responseFormat: projectIdeaSchema,
  });
  // Return the first choice from the Mistral response as a JSON response
  return Response.json(response.choices?.[0]?.message?.parsed);
}
