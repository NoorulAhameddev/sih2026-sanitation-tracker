import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AttendanceStats from '../components/attendance/AttendanceStats';
import AttendanceCard from '../components/attendance/AttendanceCard';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { useAttendance } from '../hooks/useAttendance';
import { Truck } from 'lucide-react';

const Dashboard = () => {
  const { data, isLoading, isError, refetch } = useAttendance();
  const records = data?.records;

  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return { total: 0, covered: 0, uncovered: 0, complaints: 0 };
    }
    return {
      total: records.length,
      covered: records.filter((r) => r.covered === 'Yes').length,
      uncovered: records.filter((r) => r.covered === 'No').length,
      complaints: records.reduce((sum, r) => sum + (Number(r.complaints_received) || 0), 0),
    };
  }, [records]);

  // Show up to 6 priority/recent records
  const recentRecords = useMemo(() => {
    if (!records) return [];
    return records.slice(0, 6);
  }, [records]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div>
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load supervisor dashboard"
        description="Could not connect to the server. Please check if the backend is running."
        icon={Truck}
        action={
          <Button variant="outline" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Supervisor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Waste Collection Worker Attendance and Route Register Overview.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Route & Coverage Overview</h2>
        <AttendanceStats stats={stats} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Attention Required & Priority Activity</h2>
            <p className="text-xs text-muted-foreground">Uncovered routes and high-complaint areas appear first</p>
          </div>
          {records && records.length > 0 && (
            <Link to="/attendance">
              <Button variant="ghost" size="sm">View All Registers</Button>
            </Link>
          )}
        </div>
        {recentRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRecords.map((record) => (
              <AttendanceCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Route Records Yet"
            description="Record worker attendance and route coverage to see daily activity here."
            icon={Truck}
            action={
              <Link to="/attendance/new">
                <Button>Record Route Coverage</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
