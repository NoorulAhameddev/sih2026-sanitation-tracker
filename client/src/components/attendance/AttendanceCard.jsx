import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import { Calendar, User, MapPin, MessageSquare, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const AttendanceCard = ({ record }) => {
  const navigate = useNavigate();
  
  if (!record) return null;

  const isUncovered = record.covered === 'No';

  return (
    <Card className={`hover:shadow-md transition-shadow ${isUncovered ? 'border-l-4 border-l-danger bg-red-50/20' : ''}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{record.worker_name}</CardTitle>
          <p className="text-xs text-muted-foreground">ID: {record.worker_id}</p>
        </div>
        {isUncovered ? (
          <Badge variant="error" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Uncovered</Badge>
        ) : (
          <Badge variant="success">Covered</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              <span>{record.route_id} ({record.ward})</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              record.complaints_received > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
            }`}>
              {record.complaints_received} complaints
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{record.date}</span>
          </div>
          {record.remarks && (
            <div className="flex items-start mt-2 text-xs bg-muted/40 p-2 rounded">
              <MessageSquare className="mr-1.5 h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span className="truncate">{record.remarks}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-border mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/attendance/${record.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceCard;
