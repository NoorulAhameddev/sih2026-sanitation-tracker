import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceForm from '../../components/attendance/AttendanceForm';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCreateAttendance } from '../../hooks/useAttendance';
import { CheckCircle } from 'lucide-react';

const CreateAttendance = () => {
  const navigate = useNavigate();
  const createMutation = useCreateAttendance();
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = (data) => {
    setServerError(null);
    createMutation.mutate(data, {
      onSuccess: (res) => {
        setSuccessData(res.data);
      },
      onError: (error) => {
        const message = error.response?.data?.error?.message || 'An unexpected error occurred';
        setServerError(message);
      },
    });
  };

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-center py-12">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Record Saved Successfully!</h1>
        <p className="text-muted-foreground mt-1">
          Server Calculated Priority Score: <span className="font-bold text-foreground">{successData.priority_score}</span>
        </p>
        <div className="mt-8">
          <Button onClick={() => navigate('/attendance')}>Return to Register</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Record Route Coverage</h1>
        <p className="text-muted-foreground mt-1">Log depot worker attendance, assigned route, coverage status, and complaints.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Register Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceForm 
            onSubmit={handleSubmit} 
            isSubmitting={createMutation.isPending}
            serverError={serverError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAttendance;
