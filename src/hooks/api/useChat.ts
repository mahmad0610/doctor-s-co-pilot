// React Query hooks for Chat API
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/lib/api/chat';
import { useState } from 'react';
import type { ChatResponse, ChatHistoryMessage } from '@/types';

interface UseChatOptions {
  patientId: string;
  onSuccess?: (response: ChatResponse) => void;
}

export function useChat({ patientId, onSuccess }: UseChatOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  
  const mutation = useMutation({
    mutationFn: (message: string) => sendMessage(patientId, message, sessionId),
    onSuccess: (response) => {
      setSessionId(response.session_id);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.reply }
      ]);
      onSuccess?.(response);
    },
  });

  const sendUserMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    mutation.mutate(content);
  };

  const resetChat = () => {
    setSessionId(null);
    setMessages([]);
  };

  return {
    sessionId,
    messages,
    sendMessage: sendUserMessage,
    resetChat,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
