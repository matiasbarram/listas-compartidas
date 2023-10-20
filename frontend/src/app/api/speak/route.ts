import { GPTContext, responseSchema } from "@/lib/constants";
import OpenAI from "openai";
import { IList } from "../../../../types";


interface IResponse {
    items?: IList[]
    error?: string
    message?: string
}

export async function POST(request: Request) {
    const body = await request.json();
    const lists = body.lists as IList[]
    const message = body.message as string

    const dev = process.env.NODE_ENV === "development" ? true : false;

    if (dev) {
        return Response.json(
            { "items": [{ "name": "palta", "list": "Supermercado", "quantity": 1 }, { "name": "tomate", "list": "Supermercado", "quantity": 1 }, { "name": "lechuga", "list": "Supermercado", "quantity": 1 }] }
        );
    }

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
    const jsonResponse: IResponse = JSON.parse(content);
    if (jsonResponse.error) {
        return new Response(jsonResponse.error, { status: 400 })
    }

    return Response.json(jsonResponse);

}
