import { test, expect } from '@playwright/test';

test.describe('GET /api/courses', () => {
  test('should return course list with correct schema', async ({ request }) => {
    const response = await request.get('/api/courses');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Validate response schema
    expect(data).toHaveProperty('courses');
    expect(data).toHaveProperty('meta');
    expect(Array.isArray(data.courses)).toBe(true);
    
    // Validate meta structure
    expect(data.meta).toHaveProperty('total');
    expect(data.meta).toHaveProperty('page');
    expect(data.meta).toHaveProperty('pageSize');
    expect(typeof data.meta.total).toBe('number');
    expect(typeof data.meta.page).toBe('number');
    expect(typeof data.meta.pageSize).toBe('number');
    
    // Validate course structure if courses exist
    if (data.courses.length > 0) {
      const course = data.courses[0];
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('description');
      expect(course).toHaveProperty('slug');
      expect(course).toHaveProperty('level');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('price');
      
      // Validate data types
      expect(typeof course.id).toBe('string');
      expect(typeof course.title).toBe('string');
      expect(typeof course.description).toBe('string');
      expect(typeof course.slug).toBe('string');
      expect(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).toContain(course.level);
      expect(typeof course.duration).toBe('string');
    }
  });

  test('should only return published and public courses', async ({ request }) => {
    const response = await request.get('/api/courses');
    const data = await response.json();
    
    // All returned courses should be public and published
    data.courses.forEach((course: any) => {
      expect(course.status).toBe('PUBLISHED');
      expect(course.isPublic).toBe(true);
    });
  });

  test('should support pagination parameters', async ({ request }) => {
    const response = await request.get('/api/courses?page=1&pageSize=2');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.meta.page).toBe(1);
    expect(data.meta.pageSize).toBe(2);
    expect(data.courses.length).toBeLessThanOrEqual(2);
  });

  test('should handle empty result with fallbacks', async ({ request }) => {
    // This test assumes we might have no published courses
    const response = await request.get('/api/courses');
    const data = await response.json();
    
    if (data.courses.length === 0) {
      expect(data.meta.total).toBe(0);
      expect(Array.isArray(data.courses)).toBe(true);
    }
  });
});