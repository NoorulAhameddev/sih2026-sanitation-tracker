import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { Calendar, User, MapPin, MessageSquare, ArrowLeft, Edit2, AlertCircle, Truck } from 'lucide-react';
import { useAttendanceById } from '../../hooks/useAttendance';

const AttendanceDetails = () => {
  const { id } = useParams();
  const { data: record, isLoading, isError, refetch } = useAttendanceById(id);

  if (isLoading) {
    return <Loader size="lg" />;
  }

  if (isError || !record) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState
          title="Record Not Found"
          description="The route attendance record you are looking for could not be found."
          icon={AlertCircle}
          action={
            <div className="flex space-x-2">
              <Link to="/attendance">
                <Button variant="outline">Back to Register</Button>
              </Link>
              <Button variant="outline" onClick={refetch}>
                Retry
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const isUncovered = record.covered === 'No';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/attendance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Route Record Details</h1>
            <p className="text-muted-foreground mt-1">Viewing register entry #{id}</p>
          </div>
        </div>
        <Link to={`/attendance/${id}/edit`}>
          <Button variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Entry
          </Button>
        </Link>
      </div>

      <Card className={isUncovered ? 'border-l-4 border-l-danger' : ''}>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Route Coverage Log
          </CardTitle>
          {isUncovered ? (
            <Badge variant="error" className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Uncovered (Attention Required)</Badge>
          ) : (
            <Badge variant="success">Route Covered</Badge>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center">
                <User className="w-4 h-4 mr-2" />
                Sanitation Worker
              </dt>
              <dd className="mt-1 text-sm text-foreground font-semibold">
                {record.worker_name} ({record.worker_id})
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Assigned Route & Ward
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                <span className="font-semibold">{record.route_id}</span> — {record.ward}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {record.date}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Complaints Received
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${
                  record.complaints_received > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                }`}>
                  {record.complaints_received} complaint{record.complaints_received !== 1 ? 's' : ''}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">
                Depot Clerk Remarks
              </dt>
              <dd className="mt-1 text-sm text-foreground bg-muted/40 p-3 rounded-md">
                {record.remarks || <span className="italic text-gray-400">No remarks provided.</span>}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDetails;
