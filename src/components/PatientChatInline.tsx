import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  Send,
  Loader2,
  User,
  Sparkles,
  RotateCcw,
  Stethoscope,
  Search,
  Calendar,
  Plus,
} from 'lucide-react';
import { useChat } from '@/hooks/api/useChat';
import { useUserStore } from '@/stores/userStore';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientChatInlineProps {
  onNavigate?: (tab: string) => void;
}

export function PatientChatInline({ onNavigate }: PatientChatInlineProps) {
  const { patientId, setMockPatientId } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const suggestions = [
    { icon: Stethoscope, label: 'Find a Specialist', message: 'I need to find a specialist doctor' },
    { icon: Search, label: 'Search Symptoms', message: 'I have chest pain, which doctor should I see?' },
    { icon: Calendar, label: 'Book Appointment', message: 'Help me book a doctor appointment' },
    { icon: Plus, label: 'General Checkup', message: 'I want to schedule a general checkup' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="max-w-3xl mx-auto px-4 py-6">
            {!hasMessages ? (
              /* Empty state - Claude-style centered greeting */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-2">
                  {getGreeting()}
                </h1>
                <p className="text-muted-foreground text-base mb-10 max-w-md text-center">
                  I'm your AI Health Assistant. Describe your symptoms, find doctors, or book appointments.
                </p>

                {/* Quick action chips */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all text-left group"
                      onClick={() => sendMessage(s.message)}
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                        <s.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Chat messages */
              <div className="space-y-5 pb-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-md'
                            : 'bg-card border border-border rounded-tl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="h-8 w-8 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        AI is thinking...
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input area - Claude-style */}
      <div className="border-t bg-background px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm focus-within:border-primary/30 focus-within:shadow-md transition-all">
            <Input
              placeholder="Describe your symptoms or ask about doctors..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={isLoading}
              className="border-0 shadow-none focus-visible:ring-0 px-0 text-base bg-transparent placeholder:text-muted-foreground/60"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {hasMessages && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={resetChat}
                  title="New conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Contextual chips below input */}
          {hasMessages && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {[
                { label: 'Find Doctors', action: () => onNavigate?.('doctors') },
                { label: 'My Appointments', action: () => onNavigate?.('appointments') },
                { label: 'Book New', action: () => onNavigate?.('doctors') },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.action}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all text-muted-foreground hover:text-foreground"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
            AI-generated responses · Always consult a doctor for medical advice
          </p>
        </div>
      </div>
    </div>
  );
}
