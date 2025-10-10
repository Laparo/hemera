'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import Image from 'next/image';
import React, { useState } from 'react';

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
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  availableSpots?: number | null;
  totalBookings?: number;
  userBookingStatus?: string | null;
}

interface CourseDetailProps {
  course: Course;
  onBookNow?: (courseId: string) => void;
  isLoading?: boolean;
}

const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onBookNow,
  isLoading = false,
}) => {
  const [isBooking, setIsBooking] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleBookNow = async () => {
    if (onBookNow && !isBooking) {
      setIsBooking(true);
      try {
        await onBookNow(course.id);
      } finally {
        setIsBooking(false);
      }
    }
  };

  const getBookingButtonText = () => {
    if (isBooking) return 'Buchung läuft...';
    if (course.userBookingStatus === 'PAID') return 'Bereits gebucht';
    if (course.userBookingStatus === 'PENDING') return 'Zahlung ausstehend';
    if (course.availableSpots === 0) return 'Ausgebucht';
    return 'Jetzt buchen';
  };

  const isBookingDisabled = (): boolean => {
    return Boolean(
      isBooking ||
        course.userBookingStatus === 'PAID' ||
        (course.availableSpots !== null && course.availableSpots === 0) ||
        !course.isPublished ||
        (course.date && course.date < new Date())
    );
  };

  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='h-64 bg-gray-200 rounded-lg mb-6'></div>
        <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6 mb-6'></div>
        <div className='h-12 bg-gray-200 rounded w-32'></div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      {/* Course Image */}
      {course.image && (
        <div className='aspect-video bg-gray-100 relative'>
          <Image
            src={course.image}
            alt={course.title}
            fill
            className='object-cover'
          />
        </div>
      )}

      <div className='p-6'>
        {/* Course Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {course.title}
          </h1>

          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4'>
            {course.date && (
              <div className='flex items-center'>
                <svg
                  className='w-4 h-4 mr-1.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z'
                  />
                </svg>
                {format(course.date, 'PPP', { locale: de })}
              </div>
            )}

            {course.capacity && (
              <div className='flex items-center'>
                <svg
                  className='w-4 h-4 mr-1.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                {course.availableSpots !== null ? (
                  <span>
                    {course.availableSpots} von {course.capacity} Plätzen
                    verfügbar
                  </span>
                ) : (
                  <span>{course.capacity} Plätze</span>
                )}
              </div>
            )}

            <div className='flex items-center'>
              <svg
                className='w-4 h-4 mr-1.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
              {formatCurrency(course.price, course.currency)}
            </div>
          </div>

          {/* Course Status Badges */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {!course.isPublished && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                Nicht veröffentlicht
              </span>
            )}

            {course.userBookingStatus === 'PAID' && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                ✓ Gebucht
              </span>
            )}

            {course.userBookingStatus === 'PENDING' && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                ⏳ Zahlung ausstehend
              </span>
            )}

            {course.availableSpots === 0 && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                Ausgebucht
              </span>
            )}

            {course.date && course.date < new Date() && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                Vergangen
              </span>
            )}
          </div>
        </div>

        {/* Course Description */}
        {course.description && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
              Kursbeschreibung
            </h2>
            <div className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
              {course.description}
            </div>
          </div>
        )}

        {/* Booking Information */}
        <div className='bg-gray-50 rounded-lg p-6 mb-6'>
          <h3 className='font-semibold text-gray-900 mb-3'>
            Buchungsinformationen
          </h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex justify-between'>
              <span>Preis:</span>
              <span className='font-medium text-gray-900'>
                {formatCurrency(course.price, course.currency)}
              </span>
            </div>

            {course.capacity && (
              <div className='flex justify-between'>
                <span>Verfügbare Plätze:</span>
                <span className='font-medium text-gray-900'>
                  {course.availableSpots ?? course.capacity}
                </span>
              </div>
            )}

            {course.totalBookings !== undefined && (
              <div className='flex justify-between'>
                <span>Bereits gebucht:</span>
                <span className='font-medium text-gray-900'>
                  {course.totalBookings}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Button */}
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500'>
            Erstellt{' '}
            {formatDistanceToNow(course.createdAt, {
              addSuffix: true,
              locale: de,
            })}
          </div>

          {onBookNow && (
            <button
              onClick={handleBookNow}
              disabled={isBookingDisabled()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isBookingDisabled()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {getBookingButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
