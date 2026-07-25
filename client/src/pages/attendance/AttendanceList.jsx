import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AttendanceFilters from '../../components/attendance/AttendanceFilters';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useAttendance } from '../../hooks/useAttendance';

const AttendanceList = () => {
  const [filters, setFilters] = useState({
    search: '',
    ward: '',
    covered: '',
    date: ''
  });

  const { data, isLoading, isError, refetch } = useAttendance(filters);
  const records = data?.records;
  const totalDatasetCount = data?.totalDatasetCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Route Coverage Register</h1>
          <p className="text-muted-foreground mt-1">Track worker attendance, route coverage, and resident complaints.</p>
        </div>
        <Link to="/attendance/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Record Route Coverage
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-border">
        <AttendanceFilters filters={filters} setFilters={setFilters} />
        <AttendanceTable 
          data={records} 
          isLoading={isLoading} 
          isError={isError}
          refetch={refetch}
        />
        
        {records && records.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-2 text-sm text-muted-foreground">
            <div>
              Showing {records.length} of {totalDatasetCount} records
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
