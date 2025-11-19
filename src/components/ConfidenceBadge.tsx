import { Badge } from '@/components/ui/badge';
import { ConfidenceLevel } from '@/types';

interface ConfidenceBadgeProps {
  confidence: number;
  className?: string;
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const level: ConfidenceLevel = 
    confidence >= 80 ? 'high' : 
    confidence >= 60 ? 'medium' : 
    'low';

  const colors = {
    high: 'bg-confidence-high text-white',
    medium: 'bg-confidence-medium text-white',
    low: 'bg-confidence-low text-white',
  };

  return (
    <Badge className={`${colors[level]} ${className}`}>
      {confidence}% Confidence
    </Badge>
  );
}
