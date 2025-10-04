import { Box, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { ClerkUser } from '@/lib/types/auth';
import { filterNavigationByRole } from '@/lib/auth/permissions';

interface ProtectedNavigationProps {
  'data-testid'?: string;
  user: ClerkUser;
}

/**
 * Main navigation for protected areas
 *
 * Provides tab-based navigation between different sections
 * of the protected application area with role-based visibility.
 */
export function ProtectedNavigation({
  'data-testid': testId,
  user,
}: ProtectedNavigationProps) {
  const availableNavigation = filterNavigationByRole(user);

  return (
    <Box
      data-testid={testId || 'protected-navigation'}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={false} // Server component - no current path detection
        aria-label='protected area navigation'
        sx={{ minHeight: 48 }}
      >
        {availableNavigation.map(navItem => (
          <Tab
            key={navItem.route}
            label={navItem.label}
            value={navItem.route}
            component={Link}
            href={navItem.route}
            sx={{ minHeight: 48 }}
            data-testid={`nav-${navItem.label.toLowerCase()}`}
          />
        ))}
      </Tabs>
    </Box>
  );
}
