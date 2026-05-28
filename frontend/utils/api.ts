import type { ChatResponse, ImageChatPayload } from "@/types/chat"
import { clearAuth, getAuthHeaders } from "@/lib/auth"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

async function handleAuthError(response: Response): Promise<void> {
  if (response.status === 401 && typeof window !== "undefined") {
    clearAuth()
    window.location.href = "/login"
    throw new Error("Session expired. Please sign in again.")
  }
}

export const chatApi = {
  async sendMessage(
    messages: ChatMessage[],
    signal?: AbortSignal
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ messages }),
        signal,
      })

      await handleAuthError(response)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error
      }
      console.error("API Error:", error)
      throw error instanceof Error
        ? error
        : new Error("Failed to send message to backend")
    }
  },

  async sendImageMessage(
    payload: ImageChatPayload,
    signal?: AbortSignal
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/image`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        signal,
      })

      await handleAuthError(response)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error
      }
      console.error("Image API Error:", error)
      throw error instanceof Error
        ? error
        : new Error("Failed to send image to backend")
    }
  },
}
