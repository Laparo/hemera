export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import BookingForm from '@/components/booking/BookingForm';
import { hasUserBookedCourse } from '@/lib/api/bookings';
import { getPublishedCourses } from '@/lib/api/courses';
import { requireAuthenticatedUser } from '@/lib/auth/helpers';
import { SchoolOutlined } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Book a Course - Hemera Academy',
  description: 'Book your course at Hemera Academy',
  robots: 'noindex,nofollow',
};

interface BookingNewPageProps {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function BookingNewPage({
  searchParams,
}: BookingNewPageProps) {
  const user = await requireAuthenticatedUser();
  const courses = await getPublishedCourses();
  const params = await searchParams;

  let selectedCourse = null as { id: string } | null;
  let alreadyBooked = false;

  if (params.courseId) {
    selectedCourse =
      courses.find(course => course.id === params.courseId) || null;
    if (selectedCourse) {
      alreadyBooked = await hasUserBookedCourse(user.id, selectedCourse.id);
    }
  }

  if (alreadyBooked) {
    redirect('/bookings?message=already-booked');
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Book a Course
      </Typography>
      <Typography variant='body1' color='text.secondary' paragraph>
        Select a course to book and start your learning journey.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Available Courses
              </Typography>

              {courses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <SchoolOutlined
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant='h6' color='text.secondary'>
                    No courses available
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Check back soon for new course offerings!
                  </Typography>
                </Box>
              ) : (
                <BookingForm
                  courses={courses}
                  userId={user.id}
                  selectedCourseId={params.courseId}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Booking Information
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant='subtitle2' gutterBottom>
                    How it works
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    1. Select a course from the available options
                    <br />
                    2. Review course details and pricing
                    <br />
                    3. Submit your booking request
                    <br />
                    4. Receive confirmation and further instructions
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='subtitle2' gutterBottom>
                    Booking Status
                  </Typography>
                  <Stack direction='row' spacing={1} flexWrap='wrap'>
                    <Chip label='Pending' color='warning' size='small' />
                    <Typography variant='caption' color='text.secondary'>
                      Review in progress
                    </Typography>
                  </Stack>
                  <Stack
                    direction='row'
                    spacing={1}
                    flexWrap='wrap'
                    sx={{ mt: 1 }}
                  >
                    <Chip label='Confirmed' color='success' size='small' />
                    <Typography variant='caption' color='text.secondary'>
                      Ready to start
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
