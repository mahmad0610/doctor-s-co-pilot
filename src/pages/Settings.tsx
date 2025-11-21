import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Bell, Link2, Monitor, Smartphone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const integrations = [
    { 
      name: 'EMR System', 
      status: 'Not Connected', 
      icon: Monitor,
      description: 'Connect your Electronic Medical Records system'
    },
    { 
      name: 'Patient Devices', 
      status: 'Connected (3)', 
      icon: Smartphone,
      description: 'Manage connected patient monitoring devices'
    },
    { 
      name: 'Email Service', 
      status: 'Connected', 
      icon: Mail,
      description: 'Send automated reminders and notifications'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get real-time alerts on your device</p>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize your dashboard appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Integrations
            </CardTitle>
            <CardDescription>Manage external service connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    <integration.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={integration.status.includes('Connected') ? 'default' : 'outline'}>
                    {integration.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {integration.status.includes('Connected') ? 'Manage' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure external API endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Triage API Endpoint</Label>
              <Input 
                placeholder="/api/v1/triage/" 
                defaultValue="/api/v1/triage/"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Planner API Endpoint</Label>
              <Input 
                placeholder="/api/v1/planner/" 
                defaultValue="/api/v1/planner/"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}
