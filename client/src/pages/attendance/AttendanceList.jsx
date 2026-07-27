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

  const runConcurrencyTest = async () => {
    alert("Starting Concurrency Test! Firing 2 simultaneous identical requests...");
    const payload = {
      worker_id: 'WRK-BROWSER-RACE',
      worker_name: 'Browser Race Test',
      phone_number: '9999999999',
      route_id: 'RT-RACE',
      ward: 'Ward-RACE',
      covered: 'Yes',
      complaints_received: 0,
      date: '2026-01-01',
      remarks: 'Browser Concurrency test'
    };

    const req1 = fetch('/api/v1/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const req2 = fetch('/api/v1/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    
    try {
      const [res1, res2] = await Promise.all([req1, req2]);
      alert(`Test Complete!\n\nRequest A Status: ${res1.status} (${res1.status === 201 ? 'Success' : 'Failed'})\nRequest B Status: ${res2.status} (${res2.status === 409 ? 'Refused as Duplicate' : 'Failed'})\n\nResult: ${res1.status === 201 && res2.status === 409 ? '✅ PASS - Concurrency Safety Works!' : '❌ FAIL'}`);
      refetch();
    } catch (e) {
      alert("Test Error: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Route Coverage Register</h1>
          <p className="text-muted-foreground mt-1">Track worker attendance, route coverage, and resident complaints.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={runConcurrencyTest} style={{ borderColor: 'red', color: 'red' }}>
            Run Concurrency Test
          </Button>
          <Link to="/attendance/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Route Coverage
            </Button>
          </Link>
        </div>
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
