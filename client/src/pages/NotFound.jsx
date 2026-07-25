import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <EmptyState
        title="Page Not Found"
        description="We couldn't find the page you're looking for. Please check the URL or return to the dashboard."
        icon={AlertCircle}
        action={
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
