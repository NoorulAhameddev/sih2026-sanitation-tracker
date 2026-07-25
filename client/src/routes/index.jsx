import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';
import AttendanceList from '../pages/attendance/AttendanceList';
import CreateAttendance from '../pages/attendance/CreateAttendance';
import EditAttendance from '../pages/attendance/EditAttendance';
import AttendanceDetails from '../pages/attendance/AttendanceDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'attendance',
        element: <AttendanceList />
      },
      {
        path: 'attendance/new',
        element: <CreateAttendance />
      },
      {
        path: 'attendance/:id',
        element: <AttendanceDetails />
      },
      {
        path: 'attendance/:id/edit',
        element: <EditAttendance />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
]);
