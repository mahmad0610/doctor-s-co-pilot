import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Bot, Send, Loader2, User, Sparkles, RotateCcw } from 'lucide-react';
import { useChat } from '@/hooks/api/useChat';
import { useUserStore } from '@/stores/userStore';

interface PatientChatWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientChatWidget({ open, onOpenChange }: PatientChatWidgetProps) {
  const { patientId, setMockPatientId } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-set mock patient for MVP
  if (!patientId) setMockPatientId();

  const { messages, sendMessage, isLoading, resetChat } = useChat({
    patientId: patientId || '',
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInputValue('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 pb-3 border-b bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-primary-foreground flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              AI Health Assistant
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/10 h-8 w-8"
              onClick={resetChat}
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs opacity-80">
            Describe your symptoms or ask about doctors. I can search and book for you.
          </p>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Hi! I'm your AI Health Assistant</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                  I can help you find the right doctor, book appointments, or answer health-related questions.
                </p>
                <div className="space-y-2 max-w-xs mx-auto">
                  {[
                    "I have chest pain, which doctor should I see?",
                    "Find me a dermatologist in Lahore",
                    "What specialists treat migraines?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="w-full text-left text-sm px-4 py-2.5 rounded-lg border hover:bg-muted transition-colors"
                      onClick={() => {
                        sendMessage(suggestion);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-md'
                      : 'bg-muted rounded-tl-md'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            AI-generated responses · Always consult a doctor for medical advice
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
