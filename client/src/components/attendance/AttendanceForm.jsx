import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const attendanceSchema = z.object({
  worker_id: z.string().min(1, "Worker ID is required").max(50),
  worker_name: z.string().min(1, "Worker name is required").max(100),
  route_id: z.string().min(1, "Route ID is required").max(50),
  ward: z.string().min(1, "Ward is required").max(50),
  covered: z.enum(['Yes', 'No'], {
    errorMap: () => ({ message: "Please select if route was covered (Yes or No)" })
  }),
  complaints_received: z.coerce.number().int({ message: "Must be a whole number" }).min(0, "Complaints cannot be negative"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  remarks: z.string().optional().default(''),
});

const AttendanceForm = ({ defaultValues, onSubmit, isSubmitting = false, serverError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: defaultValues || {
      worker_id: '',
      worker_name: '',
      route_id: '',
      ward: '',
      covered: 'Yes',
      complaints_received: 0,
      date: new Date().toISOString().split('T')[0],
      remarks: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-md bg-danger/10 border border-danger/30 p-4">
          <p className="text-sm text-danger font-medium">{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Worker ID</label>
          <Input 
            {...register('worker_id')} 
            placeholder="e.g. WRK-101" 
            error={errors.worker_id?.message}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Worker Name</label>
          <Input 
            {...register('worker_name')} 
            placeholder="e.g. Ramesh Kumar" 
            error={errors.worker_name?.message}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Route ID</label>
          <Input 
            {...register('route_id')} 
            placeholder="e.g. RT-01" 
            error={errors.route_id?.message}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ward / Area</label>
          <Input 
            {...register('ward')} 
            placeholder="e.g. Ward-1" 
            error={errors.ward?.message}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Route Covered Status</label>
          <Select {...register('covered')} error={errors.covered?.message} disabled={isSubmitting}>
            <option value="Yes">Yes — Covered</option>
            <option value="No">No — Uncovered (Missed)</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Complaints Received</label>
          <Input 
            type="number" 
            min="0"
            {...register('complaints_received')} 
            error={errors.complaints_received?.message}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date</label>
          <Input 
            type="date" 
            {...register('date')} 
            error={errors.date?.message}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Remarks / Issues</label>
          <Input 
            {...register('remarks')} 
            placeholder="e.g. Vehicle breakdown near main junction" 
            error={errors.remarks?.message}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 border-t border-border pt-6">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Save Route Register
        </Button>
      </div>
    </form>
  );
};

export default AttendanceForm;
