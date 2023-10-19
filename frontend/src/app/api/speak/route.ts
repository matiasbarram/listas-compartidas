import { GPTContext, responseSchema } from "@/lib/constants";
import OpenAI from "openai";
import { IList } from "../../../../types";

export async function POST(request: Request) {
    const body = await request.json();
    const lists = body.lists as IList[]
    const message = body.message as string

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const listsNames = lists.map(list => list.name)
    const listsAlternatives = listsNames.join(", ")

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": GPTContext
            },
            {
                "role": "user",
                "content": message
            },
            {
                "role": "assistant",
                "content": `the posible lists are ${listsAlternatives}`
            }
        ],
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    const content = response.choices[0].message.content || "";
    const jsonResponse = JSON.parse(content);

    return Response.json(jsonResponse);

}
