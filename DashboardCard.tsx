import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  percentage?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  percentage
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
          
          {percentage && (
            <div className="flex items-center mt-2">
              <span 
                className={`text-sm font-medium ${
                  percentage.isPositive ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {percentage.isPositive ? '+' : ''}{percentage.value}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;