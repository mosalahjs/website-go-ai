const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://www.goai-bot-backend.goai247.com"
}/api/goai`;

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ApiSession {
  session_id: string;
  messages: ApiMessage[];
  last_message_at: string;
  message_count: number;
}

export interface ApiHistoryResponse {
  success: boolean;
  data?: {
    sessions: ApiSession[];
    total_sessions: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  message?: string;
}

/**
 * Fetch session history with pagination
 */
export async function fetchSessionHistory(
  page: number = 1,
  limit: number = 10
): Promise<ApiHistoryResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/history?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session history:", error);
    throw error;
  }
}

/**
 * Fetch a specific session by ID
 */
export async function fetchSessionById(
  sessionId: string
): Promise<ApiSession | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

/**
 * Create a new session (if API supports it)
 */
export async function createSession(
  sessionId: string,
  initialMessage: ApiMessage
): Promise<ApiSession | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        messages: [initialMessage],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

/**
 * Delete a session (if API supports it)
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

/**
 * Add a message to a session (if API supports it)
 */
export async function addMessageToSession(
  sessionId: string,
  message: ApiMessage
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error adding message:", error);
    return false;
  }
}
