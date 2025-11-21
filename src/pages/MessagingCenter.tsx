import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPatients, mockMessages } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AILabel } from '@/components/AILabel';

export default function MessagingCenter() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [messageInput, setMessageInput] = useState('');
  const patientMessages = mockMessages.filter(m => m.patientId === selectedPatient.id);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      toast.success('Message sent');
      setMessageInput('');
    }
  };

  const handleAISuggestedReply = (reply: string) => {
    setMessageInput(reply);
    toast.info('AI suggestion applied');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
          <h1 className="text-3xl font-bold">Messaging Center</h1>
          <p className="text-muted-foreground">Patient communications with AI assistance</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Patients</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {mockPatients.map(patient => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 cursor-pointer border-b hover:bg-accent transition-colors ${
                        selectedPatient.id === patient.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{patient.age} yrs</div>
                        </div>
                        {patient.unreadMessages > 0 && (
                          <Badge variant="destructive">{patient.unreadMessages}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedPatient.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last visit: {format(selectedPatient.lastVisit, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">Current Vitals</div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline">HR: {selectedPatient.vitals.heartRate}</Badge>
                      <Badge variant="outline">BP: {selectedPatient.vitals.bloodPressure}</Badge>
                      <Badge variant="outline">O2: {selectedPatient.vitals.oxygenLevel}%</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {patientMessages.map(message => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">{message.senderName[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.senderName}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(message.timestamp, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <div className="bg-accent p-3 rounded-lg">
                            {message.content}
                          </div>
                        </div>
                      </div>
                      
                      {message.aiSuggestedReply && (
                        <div className="ml-11 p-3 border border-primary/20 rounded-lg bg-primary/5">
                          <AILabel />
                          <p className="text-sm mt-2">{message.aiSuggestedReply}</p>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="mt-2"
                            onClick={() => handleAISuggestedReply(message.aiSuggestedReply!)}
                          >
                            <Sparkles className="mr-2 h-3 w-3" />
                            Use this reply
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <CardContent className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
