import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Search } from 'lucide-react';

const AttendanceFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input 
          type="text"
          placeholder="Search by worker, route ID, or ward..."
          className="pl-9"
          value={filters?.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="w-full md:w-48">
        <Select 
          value={filters?.ward || ''} 
          onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
        >
          <option value="">All Wards</option>
          <option value="Ward-1">Ward-1</option>
          <option value="Ward-2">Ward-2</option>
          <option value="Ward-3">Ward-3</option>
          <option value="Ward-4">Ward-4</option>
          <option value="Ward-5">Ward-5</option>
          <option value="Ward-6">Ward-6</option>
          <option value="Ward-7">Ward-7</option>
          <option value="Ward-8">Ward-8</option>
          <option value="Ward-9">Ward-9</option>
          <option value="Ward-10">Ward-10</option>
        </Select>
      </div>
      <div className="w-full md:w-48">
        <Select 
          value={filters?.covered || ''} 
          onChange={(e) => setFilters({ ...filters, covered: e.target.value })}
        >
          <option value="">All Coverage</option>
          <option value="Yes">Covered (Yes)</option>
          <option value="No">Uncovered (No)</option>
        </Select>
      </div>
      <div className="w-full md:w-48">
        <Input 
          type="date" 
          value={filters?.date || ''}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>
    </div>
  );
};

export default AttendanceFilters;
