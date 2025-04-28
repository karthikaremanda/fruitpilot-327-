import React from 'react';
import { PluckingStat } from '../types';

interface PluckingStatsChartProps {
  stats: PluckingStat[];
}

const PluckingStatsChart: React.FC<PluckingStatsChartProps> = ({ stats }) => {
  // Find the maximum value in the dataset for scaling
  const maxValue = Math.max(...stats.flatMap(stat => [stat.apples, stat.oranges, stat.peaches]));
  
  // Scale factor for the chart (80% of the height)
  const scale = 180 / maxValue;
  
  const fruitTypes = [
    { name: 'Apples', key: 'apples', color: 'bg-red-500' },
    { name: 'Oranges', key: 'oranges', color: 'bg-orange-500' },
    { name: 'Peaches', key: 'peaches', color: 'bg-pink-400' }
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Plucking Statistics</h3>

      <div className="flex justify-start mb-3 space-x-6">
        {fruitTypes.map(fruit => (
          <div key={fruit.key} className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${fruit.color} mr-2`}></div>
            <span className="text-sm text-gray-600">{fruit.name}</span>
          </div>
        ))}
      </div>
      
      <div className="relative h-52">
        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-8 right-0 top-0 h-full">
          {[0, 1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className="absolute border-t border-gray-100 w-full"
              style={{ top: `${i * 25}%` }}
            ></div>
          ))}
        </div>
        
        {/* Chart bars */}
        <div className="absolute left-12 right-0 bottom-0 h-48 flex items-end">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-end h-full"
              style={{ width: `${100 / stats.length}%` }}
            >
              <div className="relative w-full flex flex-col items-center">
                {/* Peaches bar */}
                <div 
                  className="w-6 bg-pink-400 rounded-t"
                  style={{ height: `${stat.peaches * scale}px` }}
                ></div>
                
                {/* Oranges bar */}
                <div 
                  className="w-6 bg-orange-500 absolute bottom-0 rounded-t"
                  style={{ 
                    height: `${stat.oranges * scale}px`,
                    transform: `translateY(-${stat.peaches * scale}px)` 
                  }}
                ></div>
                
                {/* Apples bar */}
                <div 
                  className="w-6 bg-red-500 absolute bottom-0 rounded-t"
                  style={{ height: `${stat.apples * scale}px` }}
                ></div>
              </div>
              
              <span className="text-xs text-gray-500 mt-2">{stat.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PluckingStatsChart;