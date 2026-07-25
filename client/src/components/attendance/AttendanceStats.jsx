import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { MapPin, CheckCircle, AlertTriangle, MessageSquareWarning } from 'lucide-react';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card>
    <CardContent className="p-6 flex items-center space-x-4">
      <div className={cn("p-3 rounded-full", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

const AttendanceStats = ({ stats }) => {
  const { total = 0, covered = 0, uncovered = 0, complaints = 0 } = stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Route Logs" 
        value={total} 
        icon={MapPin} 
        colorClass="bg-primary/10 text-primary" 
      />
      <StatCard 
        title="Routes Covered" 
        value={covered} 
        icon={CheckCircle} 
        colorClass="bg-success/10 text-success" 
      />
      <StatCard 
        title="Uncovered (Attention)" 
        value={uncovered} 
        icon={AlertTriangle} 
        colorClass="bg-danger/10 text-danger" 
      />
      <StatCard 
        title="Complaints Received" 
        value={complaints} 
        icon={MessageSquareWarning} 
        colorClass="bg-yellow-100 text-yellow-800" 
      />
    </div>
  );
};

export default AttendanceStats;
