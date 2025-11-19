import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AILabel() {
  return (
    <Badge variant="secondary" className="gap-1">
      <Sparkles className="h-3 w-3" />
      AI-Generated • Doctor Review Required
    </Badge>
  );
}
