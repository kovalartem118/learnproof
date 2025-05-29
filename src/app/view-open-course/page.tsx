'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

interface OpenCourse {
  id: number;
  title: string;
  description: string;
  seats: number;
  participants: string[];
  image: string; 
}

export default function OpenCoursesPage() {
  const [courses, setCourses] = useState<OpenCourse[]>([]);
  const { publicKey } = useWallet();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('open_courses') || '[]');
    setCourses(stored);
  }, []);

  const handleJoin = (id: number) => {
    if (!publicKey) return alert('Підключіть гаманець!');
    const walletAddress = publicKey.toBase58();
    
    const updated = courses.map((course) => {
      if (course.id === id && 
          !course.participants.includes(walletAddress) && 
          course.participants.length < course.seats) {
        return {
          ...course,
          participants: [...course.participants, walletAddress],
        };
      }
      return course;
    });
    
    localStorage.setItem('open_courses', JSON.stringify(updated));
    setCourses(updated);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">Відкриті курси</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {course.image && (
                <div className="relative h-48 sm:h-56">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Місць: {course.participants.length} / {course.seats}
                  </p>
                  {publicKey && !course.participants.includes(publicKey.toBase58()) && course.participants.length < course.seats && (
                    <button
                      onClick={() => handleJoin(course.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
                    >
                      Приєднатись
                    </button>
                  )}
                  {publicKey && course.participants.includes(publicKey.toBase58()) && (
                    <span className="text-green-500 text-sm sm:text-base font-medium">
                      Ви вже учасник
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
