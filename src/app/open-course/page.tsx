'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreateOpenCourse.module.css'; 

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
    router.push('/open-course');
  };

  return (
    <div className={`${styles.p_8} ${styles.min_h_screen} flex justify-center items-center`}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Створити відкритий курс</h1>
        <input
          type="text"
          placeholder="Назва курсу"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Опис"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Кількість місць"
          className={styles.input}
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
        />
        <input
          type="text"
          placeholder="URL зображення"
          className={styles.input}
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button className={styles.button} onClick={handleSubmit}>
          Створити курс
        </button>
      </div>
    </div>
  );
}