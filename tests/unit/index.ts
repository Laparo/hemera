/**
 * Test runner for all unit tests
 * 
 * Executes all unit test suites and provides summary
 */

import { runMetadataTests } from './seo/metadata.test';
import { runCourseCardTests } from './components/course-card.test';
import { runSEOComponentTests } from './components/seo-components.test';

async function runAllTests() {
  console.log('🚀 Starting Hemera Academy Unit Test Suite\n');
  console.log('=' + '='.repeat(50) + '\n');
  
  try {
    // Run SEO metadata tests
    runMetadataTests();
    
    // Run component tests
    runCourseCardTests();
    
    // Run SEO component tests
    runSEOComponentTests();
    
    console.log('=' + '='.repeat(50));
    console.log('🎉 All Unit Tests Completed Successfully!');
    console.log('✅ SEO Metadata utilities validated');
    console.log('✅ CourseCard component validated');
    console.log('✅ SEO Components validated');
    console.log('=' + '='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('❌ Test suite encountered an error:', error);
    process.exit(1);
  }
}

// Auto-run if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests();
}

export { runAllTests };