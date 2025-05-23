'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateOpenCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState(3);
  const [image, setImage] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const courses = JSON.parse(localStorage.getItem('open_courses') || '[]');
    const newCourse = {
      id: Date.now(),
      title,
      description,
      seats,
      participants: [],
      image,
    };
    localStorage.setItem('open_courses', JSON.stringify([...courses, newCourse]));
    router.push('/view-open-course');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">Створити відкритий курс</h1>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Назва курсу</label>
            <input
              type="text"
              placeholder="Введіть назву курсу"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Опис</label>
            <textarea
              placeholder="Введіть опис курсу"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Кількість місць</label>
            <input
              type="number"
              placeholder="Введіть кількість місць"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL зображення</label>
            <input
              type="text"
              placeholder="Введіть URL зображення"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Створити курс
          </button>
        </div>
      </div>
    </div>
  );
}