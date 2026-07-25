import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '../api/attendanceApi';

const ATTENDANCE_KEY = 'attendance';

/**
 * Normalizes filter parameters by stripping empty strings, null, and undefined.
 * Ensures consistent React Query caching across components regardless of empty filter shapes.
 */
const normalizeFilters = (filters = {}) => {
  const clean = {};
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      clean[key] = filters[key];
    }
  });
  return clean;
};

/**
 * Fetch all attendance records with optional filters.
 */
export const useAttendance = (rawFilters = {}) => {
  const filters = normalizeFilters(rawFilters);
  return useQuery({
    queryKey: [ATTENDANCE_KEY, filters],
    queryFn: () => getAttendance(filters),
    select: (res) => ({
      records: res.data,
      totalDatasetCount: res.total_dataset_count
    }),
    retry: 1,
  });
};

/**
 * Fetch a single attendance record by ID.
 */
export const useAttendanceById = (id) => {
  return useQuery({
    queryKey: [ATTENDANCE_KEY, String(id)],
    queryFn: () => getAttendanceById(id),
    select: (res) => res.data,
    enabled: !!id,
    retry: 1,
  });
};

/**
 * Create a new attendance record.
 */
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_KEY] });
      toast.success('Attendance record created successfully!');
    },
    onError: (error) => {
      const code = error.response?.data?.error?.code;
      if (code === 'DUPLICATE_RECORD') {
        toast.error('This attendance record already exists for the given student, subject, and date.');
      }
      // Other network/server errors are handled globally by Axios interceptor
    },
  });
};

/**
 * Update an existing attendance record.
 */
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAttendance(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_KEY] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_KEY, String(variables.id)] });
      toast.success('Attendance record updated successfully!');
    },
  });
};

/**
 * Delete an attendance record with optimistic removal and rollback.
 */
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAttendance(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [ATTENDANCE_KEY] });
      const previousQueries = queryClient.getQueriesData({ queryKey: [ATTENDANCE_KEY] });

      queryClient.setQueriesData({ queryKey: [ATTENDANCE_KEY] }, (old) => {
        if (!old || !old.data) return old;
        if (!Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.filter((record) => String(record.id) !== String(id)),
        };
      });

      return { previousQueries };
    },
    onError: (error, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (error.response?.status === 404) {
        toast.error('Record not found. It may have already been deleted.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_KEY] });
    },
    onSuccess: () => {
      toast.success('Attendance record deleted successfully!');
    },
  });
};
