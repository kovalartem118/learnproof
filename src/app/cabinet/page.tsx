'use client';

import { useState } from 'react';
import styles from './cabinet.module.css';
import { Keypair } from '@solana/web3.js';

interface Course {
  id: string;
  title: string;
  progress: number;
  enrolledStudents: number;
  status: 'active' | 'completed' | 'enrolled';
  lastAccessed: string;
  participants?: string[];
}

const generateRandomSolanaAddress = () => {
  const keypair = Keypair.generate();
  return keypair.publicKey.toBase58();
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Web3 Development Fundamentals',
    progress: 75,
    enrolledStudents: 120,
    status: 'active',
    lastAccessed: '2024-03-20',
    participants: Array(120).fill(null).map(() => generateRandomSolanaAddress()),
  },
  {
    id: '2',
    title: 'Smart Contract Security',
    progress: 30,
    enrolledStudents: 85,
    status: 'enrolled',
    lastAccessed: '2024-03-19',
    participants: Array(85).fill(null).map(() => generateRandomSolanaAddress()),
  },
  {
    id: '3',
    title: 'NFT Development Masterclass',
    progress: 100,
    enrolledStudents: 150,
    status: 'completed',
    lastAccessed: '2024-03-15',
    participants: Array(150).fill(null).map(() => generateRandomSolanaAddress()),
  },
];

const mockStats = {
  totalCourses: 3,
  completedCourses: 1,
  activeCourses: 1,
  enrolledCourses: 1,
  totalStudents: 355,
};

const ITEMS_PER_PAGE = 10;

export default function CabinetPage() {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'enrolled'>('my-courses');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});

  const toggleParticipants = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    if (!currentPage[courseId]) {
      setCurrentPage(prev => ({ ...prev, [courseId]: 1 }));
    }
  };

  const handlePageChange = (courseId: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [courseId]: page }));
  };

  const getPaginatedParticipants = (participants: string[] = [], courseId: string) => {
    const page = currentPage[courseId] || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return participants.slice(startIndex, endIndex);
  };

  const getTotalPages = (participants: string[] = []) => {
    return Math.ceil(participants.length / ITEMS_PER_PAGE);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Cabinet</h1>
     
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Total Courses</h3>
          <p className={styles.statValue}>{mockStats.totalCourses}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Completed</h3>
          <p className={styles.statValue}>{mockStats.completedCourses}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Active</h3>
          <p className={styles.statValue}>{mockStats.activeCourses}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Total Students</h3>
          <p className={styles.statValue}>{mockStats.totalStudents}</p>
        </div>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'my-courses' ? styles.tabButtonActive : styles.tabButtonInactive
          }`}
          onClick={() => setActiveTab('my-courses')}
        >
          My Courses
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'enrolled' ? styles.tabButtonActive : styles.tabButtonInactive
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
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseInfo}>Enrolled Students: {course.enrolledStudents}</p>
                </div>
                <span className={`${styles.statusBadge} ${
                  course.status === 'completed'
                    ? styles.statusCompleted
                    : course.status === 'active'
                    ? styles.statusActive
                    : styles.statusEnrolled
                }`}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className={styles.lastAccessed}>
                  Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                </p>
              </div>
              <button
                className={styles.participantsButton}
                onClick={() => toggleParticipants(course.id)}
              >
                {expandedCourse === course.id ? 'Hide Participants' : 'Show Participants'}
              </button>
              {expandedCourse === course.id && (
                <>
                  <div className={styles.participantsList}>
                    {getPaginatedParticipants(course.participants, course.id).map((address, index) => (
                      <div key={index} className={styles.participantItem}>
                        {address}
                      </div>
                    ))}
                  </div>
                  <div className={styles.pagination}>
                    {Array.from({ length: getTotalPages(course.participants) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`${styles.paginationButton} ${
                          currentPage[course.id] === page
                            ? styles.paginationButtonActive
                            : styles.paginationButtonInactive
                        }`}
                        onClick={() => handlePageChange(course.id, page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
} 