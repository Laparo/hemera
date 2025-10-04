/**
 * Unit tests for SEO metadata utilities
 * 
 * Simple test functions for:
 * - Metadata generation validation
 * - Text truncation functions
 * - SEO optimization compliance
 * - Content length validation
 */

import {
  generateLandingPageMetadata,
  generateCourseListMetadata,
  truncateDescription,
} from '@/lib/seo/metadata';

// Simple test runner function
function runTest(name: string, testFn: () => void) {
  try {
    testFn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}:`, error);
  }
}

// Test suite for metadata utilities
export function runMetadataTests() {
  console.log('🧪 Running SEO Metadata Tests...\n');

  runTest('Landing page metadata has valid title', () => {
    const metadata = generateLandingPageMetadata();
    const title = metadata.title as string;
    
    if (!title || title.length < 10 || title.length > 60) {
      throw new Error(`Title length ${title?.length} is not SEO-optimized (10-60 chars)`);
    }
    
    if (!title.includes('Hemera Academy')) {
      throw new Error('Title should include brand name');
    }
  });

  runTest('Landing page metadata has valid description', () => {
    const metadata = generateLandingPageMetadata();
    const description = metadata.description as string;
    
    if (!description || description.length < 50 || description.length > 160) {
      throw new Error(`Description length ${description?.length} is not SEO-optimized (50-160 chars)`);
    }
  });

  runTest('Course list metadata has canonical URL', () => {
    const metadata = generateCourseListMetadata();
    
    if (!metadata.alternates?.canonical) {
      throw new Error('Course list metadata should have canonical URL');
    }
    
    if (metadata.alternates.canonical !== '/courses') {
      throw new Error('Canonical URL should be /courses');
    }
  });

  runTest('truncateDescription works correctly', () => {
    const shortText = 'Short text';
    const longText = 'This is a very long text that should be truncated properly';
    
    const shortResult = truncateDescription(shortText, 50);
    if (shortResult !== shortText) {
      throw new Error('Short text should not be truncated');
    }
    
    const longResult = truncateDescription(longText, 20);
    if (longResult.length > 23 || !longResult.endsWith('...')) {
      throw new Error('Long text should be truncated with ellipsis');
    }
  });

  runTest('Keywords array is properly formatted', () => {
    const metadata = generateLandingPageMetadata();
    const keywords = metadata.keywords as string[];
    
    if (!Array.isArray(keywords) || keywords.length === 0) {
      throw new Error('Keywords should be a non-empty array');
    }
    
    if (!keywords.includes('online courses')) {
      throw new Error('Keywords should include core terms');
    }
  });

  console.log('\n✅ All SEO Metadata Tests Completed\n');
}

// Auto-run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runMetadataTests();
}