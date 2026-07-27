import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from '../ui/Table';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { Eye, Edit2, Trash2, Truck, AlertTriangle } from 'lucide-react';
import { useDeleteAttendance } from '../../hooks/useAttendance';

const AttendanceTable = ({ data, isLoading, isError, refetch }) => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const deleteMutation = useDeleteAttendance();

  const handleDelete = () => {
    deleteMutation.mutate(deleteId, {
      onSettled: () => setDeleteId(null),
    });
  };

  const getCoverageBadge = (covered) => {
    if (covered === 'Yes') {
      return <Badge variant="success">Covered</Badge>;
    }
    return <Badge variant="error" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Uncovered</Badge>;
  };

  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-white p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load register records"
        description="Something went wrong while fetching route attendance data. Please try again."
        icon={Truck}
        action={
          <Button variant="outline" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState 
        title="No Route Records Found"
        description="Try adjusting your filters or record a new route coverage entry."
        icon={Truck}
      />
    );
  }

  return (
    <>
      <div className="rounded-md border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Route & Ward</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Complaints</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => {
              const isUncovered = record.covered === 'No';
              return (
                <TableRow 
                  key={record.id}
                  className={isUncovered ? "bg-red-50/50 hover:bg-red-50 border-l-4 border-l-danger" : ""}
                >
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{record.worker_name}</div>
                    <div className="text-xs text-muted-foreground">{record.worker_id}</div>
                    {record.phone_number && <div className="text-xs text-muted-foreground">📞 {record.phone_number}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{record.route_id}</div>
                    <div className="text-xs text-muted-foreground">{record.ward}</div>
                  </TableCell>
                  <TableCell>{getCoverageBadge(record.covered)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      record.complaints_received > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {record.complaints_received} complaint{record.complaints_received !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-xs">
                    {record.remarks || <span className="italic text-gray-400">None</span>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate(`/attendance/${record.id}`)}
                      title="View Record Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate(`/attendance/${record.id}/edit`)}
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setDeleteId(record.id)}
                      className="text-danger hover:text-danger hover:bg-danger/10"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Route Record"
        description="Are you sure you want to delete this route record? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default AttendanceTable;
