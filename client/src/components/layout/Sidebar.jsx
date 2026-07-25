import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Supervisor Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Route Register', href: '/attendance', icon: Truck },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-border h-full">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Truck className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-primary tracking-tight">Sanitation Register</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            C
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">Depot Clerk</p>
            <p className="text-xs font-medium text-muted-foreground">clerk@sanitation.gov</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
