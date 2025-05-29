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
    router.push('/view-open-course');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Створити відкритий курс</h1>
        
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Назва курсу</label>
            <input
              type="text"
              placeholder="Введіть назву курсу"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Опис</label>
            <textarea
              placeholder="Введіть опис курсу"
              className={`${styles.input} ${styles.textarea}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Кількість місць</label>
            <input
              type="number"
              placeholder="Введіть кількість місць"
              className={styles.input}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>URL зображення</label>
            <input
              type="text"
              placeholder="Введіть URL зображення"
              className={styles.input}
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            Створити курс
          </button>
        </div>
      </div>
    </div>
  );
}