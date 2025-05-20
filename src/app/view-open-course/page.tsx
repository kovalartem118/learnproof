'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function OpenCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const { publicKey } = useWallet();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('open_courses') || '[]');
    setCourses(stored);
  }, []);

  const handleJoin = (id: number) => {
    if (!publicKey) return alert('Підключіть гаманець!');
    const updated = courses.map((course) => {
      if (course.id === id && !course.participants.includes(publicKey.toBase58()) && course.participants.length < course.seats) {
        return {
          ...course,
          participants: [...course.participants, publicKey.toBase58()],
        };
      }
      return course;
    });
    localStorage.setItem('open_courses', JSON.stringify(updated));
    setCourses(updated);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Відкриті курси</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="card bg-base-100 shadow-md p-4">
            {course.image && (
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded mb-2" />
            )}
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p>{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Місць: {course.participants.length} / {course.seats}
            </p>
            {publicKey && !course.participants.includes(publicKey.toBase58()) && course.participants.length < course.seats && (
              <button className="btn btn-sm btn-primary mt-2" onClick={() => handleJoin(course.id)}>
                Приєднатись
              </button>
            )}
            {publicKey && course.participants.includes(publicKey.toBase58()) && (
              <p className="text-green-500 mt-2">Ви вже учасник</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
