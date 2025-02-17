import mistral from "../config/mistral.server";

export async function action() {
  const response = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "system",
        content: "Be french",
      },
      {
        role: "user",
        content: "Come up with good ideas for a hackathon project",
      },
    ],
  });
  return Response.json(response);
}
