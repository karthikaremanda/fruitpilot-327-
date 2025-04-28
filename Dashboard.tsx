import React from 'react';
import { Citrus as Fruit, Apple, Leaf } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import DroneStatusCard from '../components/DroneStatusCard';
import FruitPluckingTable from '../components/FruitPluckingTable';
import ProjectShowcase from '../components/ProjectShowcase';
import DroneCamera from '../components/DroneCamera';
import PluckingStatsChart from '../components/PluckingStatsChart';
import { fruits, droneStatus, projectInfo, pluckingStats, droneCameras } from '../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard">
            <DashboardCard
              title="Total Fruits Plucked"
              value="916 "
              icon={<Fruit className="h-6 w-6 text-white" />}
              color="bg-green-600"
              percentage={{ value: 12.3, isPositive: true }}
            />
            <DashboardCard
              title="Apples Harvested"
              value="450 "
              icon={<Apple className="h-6 w-6 text-white" />}
              color="bg-red-500"
              percentage={{ value: 8.7, isPositive: true }}
            />
            <DashboardCard
              title="Orchard Coverage"
              value="78%"
              icon={<Leaf className="h-6 w-6 text-white" />}
              color="bg-emerald-500"
              percentage={{ value: 5.2, isPositive: true }}
            />
            
          </div>
        </section>
        
        <section className="mt-8" id="camera">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Drone Camera</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DroneCamera cameras={droneCameras} />
            </div>
            <div>
              <DroneStatusCard droneStatus={droneStatus} />
            </div>
          </div>
        </section>

        <section className="mt-8" id="statistics">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <FruitPluckingTable fruits={fruits} />
            </div>
            <div className="lg:col-span-2">
              <PluckingStatsChart stats={pluckingStats} />
            </div>
          </div>
        </section>

        <section className="mt-8" id="project">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Project</h2>
          
          <div>
            <ProjectShowcase projects={projectInfo} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;