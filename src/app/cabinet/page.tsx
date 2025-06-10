'use client';

import { useState } from 'react';

interface Course {
  id: string;
  title: string;
  progress: number;
  enrolledStudents: number;
  status: 'active' | 'completed' | 'enrolled';
  lastAccessed: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Web3 Development Fundamentals',
    progress: 75,
    enrolledStudents: 120,
    status: 'active',
    lastAccessed: '2024-03-20',
  },
  {
    id: '2',
    title: 'Smart Contract Security',
    progress: 30,
    enrolledStudents: 85,
    status: 'enrolled',
    lastAccessed: '2024-03-19',
  },
  {
    id: '3',
    title: 'NFT Development Masterclass',
    progress: 100,
    enrolledStudents: 150,
    status: 'completed',
    lastAccessed: '2024-03-15',
  },
];

const mockStats = {
  totalCourses: 3,
  completedCourses: 1,
  activeCourses: 1,
  enrolledCourses: 1,
  totalStudents: 355,
};

export default function CabinetPage() {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'enrolled'>('my-courses');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Cabinet</h1>
     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-[#14F195] text-sm">Total Courses</h3>
          <p className="text-2xl font-bold">{mockStats.totalCourses}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-[#14F195] text-sm">Completed</h3>
          <p className="text-2xl font-bold">{mockStats.completedCourses}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-[#14F195] text-sm">Active</h3>
          <p className="text-2xl font-bold">{mockStats.activeCourses}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-[#14F195] text-sm">Total Students</h3>
          <p className="text-2xl font-bold">{mockStats.totalStudents}</p>
        </div>
      </div>

      
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'my-courses'
              ? 'bg-[#14F195] text-black'
              : 'bg-[#1a1a1a] text-white'
          }`}
          onClick={() => setActiveTab('my-courses')}
        >
          My Courses
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'enrolled'
              ? 'bg-[#14F195] text-black'
              : 'bg-[#1a1a1a] text-white'
          }`}
          onClick={() => setActiveTab('enrolled')}
        >
          Enrolled Courses
        </button>
      </div>

     
      <div className="space-y-4">
        {mockCourses
          .filter(course => 
            activeTab === 'my-courses' 
              ? course.status === 'active' || course.status === 'completed'
              : course.status === 'enrolled'
          )
          .map(course => (
            <div key={course.id} className="bg-[#1a1a1a] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-400">Enrolled Students: {course.enrolledStudents}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  course.status === 'completed'
                    ? 'bg-green-500 text-black'
                    : course.status === 'active'
                    ? 'bg-[#14F195] text-black'
                    : 'bg-blue-500 text-white'
                }`}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#14F195] h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 