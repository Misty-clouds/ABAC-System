import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 ${
      active ? 'bg-gray-50 border-r-4 border-blue-500' : ''
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export default NavItem;

