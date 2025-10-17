// Frontend Mistral AI client
// This client uses the Mistral API key directly in the frontend
// WARNING: This is not recommended for production use as it exposes the API key

const MISTRAL_API_KEY = "EhYxK49n9Is0rcDAa6qaPM2NlI3gCJ0b";
const MISTRAL_API_BASE_URL = "https://api.mistral.ai/v1";

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResponse {
  id: string;
  model: string;
  response: string;
  finish_reason: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MistralFrontendClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || MISTRAL_API_KEY;
    this.baseUrl = baseUrl || MISTRAL_API_BASE_URL;
  }

  async chatCompletion(
    messages: ChatMessage[],
    model: string = "mistral-tiny",
    temperature: number = 0.7,
    maxTokens?: number
  ): Promise<ChatResponse> {
    try {
      const payload = {
        model,
        messages,
        temperature,
        ...(maxTokens && { max_tokens: maxTokens }),
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Mistral API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Extract response content
      if (result.choices && result.choices.length > 0) {
        return {
          id: result.id,
          model: result.model,
          response: result.choices[0].message.content,
          finish_reason: result.choices[0].finish_reason || "stop",
          usage: result.usage,
        };
      }

      throw new Error("Unexpected response format from Mistral API");
    } catch (error) {
      console.error("Error in Mistral chat completion:", error);
      throw error;
    }
  }

  async chatCompletionWithTrashGPTPrompt(
    userMessage: string,
    conversationHistory?: ChatMessage[]
  ): Promise<ChatResponse> {
    // TrashGPT system prompt
    const systemPrompt = `You are TrashGPT, an AI assistant specializing in municipal waste management, 
recycling, and environmental sustainability. You provide helpful, accurate information about:

- Waste classification and segregation
- Recycling processes and best practices
- Municipal waste management systems
- Environmental impact and sustainability
- Waste-to-energy technologies
- Circular economy principles

You maintain a professional yet friendly tone, and can communicate in multiple languages. 
When answering questions:
1. Be concise but informative
2. Use simple language for complex concepts
3. Provide actionable advice when appropriate
4. Cite specific examples when relevant
5. Encourage sustainable practices

Always prioritize accuracy and practical applicability in your responses.`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: userMessage },
    ];

    return await this.chatCompletion(messages);
  }
}

// Export a default instance
export const mistralFrontendClient = new MistralFrontendClient();