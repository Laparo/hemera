'use client';

import CourseDetail from '@/components/CourseDetail';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  currency: string;
  capacity?: number | null;
  date?: Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  availableSpots?: number | null;
  totalBookings?: number;
  userBookingStatus?: string | null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const courseId = params.id as string;

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course from our courses API
      const response = await fetch(`/api/courses?courseId=${courseId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Kurs nicht gefunden');
        }
        throw new Error('Fehler beim Laden des Kurses');
      }

      const data = await response.json();
      if (data.courses && data.courses.length > 0) {
        setCourse(data.courses[0]);
      } else {
        throw new Error('Kurs nicht gefunden');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ein unbekannter Fehler ist aufgetreten'
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  const handleBookCourse = async (courseId: string) => {
    if (!isSignedIn) {
      // Redirect to sign in with return URL
      router.push(
        `/auth/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    try {
      setBookingLoading(true);
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen der Zahlungsseite');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert('Fehler beim Buchen des Kurses. Bitte versuchen Sie es erneut.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <div className='flex items-center'>
                <button
                  onClick={() => router.back()}
                  className='mr-4 p-2 text-gray-400 hover:text-gray-600'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>
                <div className='animate-pulse'>
                  <div className='h-6 bg-gray-200 rounded w-32'></div>
                </div>
              </div>
              <nav className='flex items-center space-x-6'>
                <a
                  href='/courses'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Alle Kurse
                </a>
                <a
                  href='/dashboard'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Dashboard
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='animate-pulse'>
            <div className='bg-white rounded-lg shadow-sm p-8'>
              <div className='h-8 bg-gray-200 rounded w-2/3 mb-4'></div>
              <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-6'></div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-2 space-y-4'>
                  <div className='h-4 bg-gray-200 rounded w-full'></div>
                  <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                  <div className='h-4 bg-gray-200 rounded w-4/5'></div>
                </div>
                <div className='space-y-4'>
                  <div className='h-12 bg-gray-200 rounded'></div>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <div className='flex items-center'>
                <button
                  onClick={() => router.back()}
                  className='mr-4 p-2 text-gray-400 hover:text-gray-600'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>
                <h1 className='text-xl font-semibold text-gray-900'>Kurs</h1>
              </div>
              <nav className='flex items-center space-x-6'>
                <a
                  href='/courses'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Alle Kurse
                </a>
                <a
                  href='/dashboard'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Dashboard
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
            <svg
              className='w-16 h-16 text-red-400 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <h2 className='text-2xl font-bold text-red-800 mb-2'>{error}</h2>
            <p className='text-red-600 mb-6'>
              Der angeforderte Kurs konnte nicht geladen werden.
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={() => router.back()}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
              >
                Zurück
              </button>
              <button
                onClick={() => router.push('/courses')}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Alle Kurse ansehen
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <button
                onClick={() => router.back()}
                className='mr-4 p-2 text-gray-400 hover:text-gray-600'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <h1 className='text-xl font-semibold text-gray-900'>
                {course.title}
              </h1>
            </div>
            <nav className='flex items-center space-x-6'>
              <a
                href='/courses'
                className='text-gray-600 hover:text-gray-900 transition-colors'
              >
                Alle Kurse
              </a>
              {isSignedIn && (
                <a
                  href='/dashboard'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Dashboard
                </a>
              )}
              {!isSignedIn && isLoaded && (
                <a
                  href='/auth/signin'
                  className='text-blue-600 hover:text-blue-700 transition-colors'
                >
                  Anmelden
                </a>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <CourseDetail
          course={course}
          isLoading={false}
          onBookNow={handleBookCourse}
        />{' '}
        {/* Related Courses Section */}
        <section className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>
            Ähnliche Kurse
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Placeholder for related courses */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'
              >
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-3'></div>
                <div className='h-3 bg-gray-200 rounded w-full mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-2/3 mb-4'></div>
                <div className='h-8 bg-gray-200 rounded w-1/2'></div>
              </div>
            ))}
          </div>
          <div className='text-center mt-8'>
            <a
              href='/courses'
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
            >
              Alle Kurse ansehen
              <svg
                className='ml-2 -mr-1 w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <p className='text-gray-500 text-sm'>
              © 2025 Hemera Learning Platform. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
