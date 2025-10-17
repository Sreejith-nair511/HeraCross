// API service for connecting frontend to backend
const API_BASE_URL = 'http://localhost:8000/api/v1'

export interface ChatMessage {
  role: string
  content: string
}

export interface ChatResponse {
  response: string
  model_used: string
}

export interface WasteAnalysisResult {
  detected_objects: string[]
  total_objects: number
  ai_insights: string
  recommendations: string[]
}

export class APIClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL
  }

  // Chat with Mistral AI
  async chatWithAI(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/inference/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })

      // If we get a 403, it means we need authentication
      // We'll throw a special error that our components can catch
      if (response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED')
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error chatting with AI:', error)
      throw error
    }
  }

  // Analyze waste image
  async analyzeWasteImage(image: File, question?: string): Promise<WasteAnalysisResult> {
    try {
      const formData = new FormData()
      formData.append('image', image)
      if (question) {
        formData.append('question', question)
      }

      const response = await fetch(`${this.baseUrl}/inference/waste-analysis-result`, {
        method: 'POST',
        body: formData,
      })

      // If we get a 403, it means we need authentication
      if (response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED')
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result = await response.json()
      return result.result || result
    } catch (error) {
      console.error('Error analyzing waste image:', error)
      throw error
    }
  }
}

// Export a default instance
export const apiClient = new APIClient()