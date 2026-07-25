import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceForm from '../../components/attendance/AttendanceForm';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { useAttendanceById, useUpdateAttendance } from '../../hooks/useAttendance';
import { AlertCircle } from 'lucide-react';

const EditAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: record, isLoading, isError, refetch } = useAttendanceById(id);
  const updateMutation = useUpdateAttendance();
  const [serverError, setServerError] = useState(null);

  const handleSubmit = (formData) => {
    setServerError(null);
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate('/attendance');
        },
        onError: (error) => {
          const message = error.response?.data?.error?.message || 'An unexpected error occurred';
          setServerError(message);
        },
      }
    );
  };

  if (isLoading) {
    return <Loader size="lg" />;
  }

  if (isError || !record) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState
          title="Record Not Found"
          description="The route attendance record you are trying to edit could not be found."
          icon={AlertCircle}
          action={
            <Button variant="outline" onClick={refetch}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Route Record</h1>
        <p className="text-muted-foreground mt-1">Modify an existing worker attendance and route log.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Route Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceForm 
            defaultValues={{
              worker_id: record.worker_id,
              worker_name: record.worker_name,
              route_id: record.route_id,
              ward: record.ward,
              covered: record.covered,
              complaints_received: record.complaints_received,
              date: record.date,
              remarks: record.remarks || '',
            }}
            onSubmit={handleSubmit} 
            isSubmitting={updateMutation.isPending}
            serverError={serverError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAttendance;
