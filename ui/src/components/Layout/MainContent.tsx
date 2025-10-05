import { Box, BoxProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export function MainContent({ children }: PropsWithChildren<BoxProps>) {
  return (
    <Box as="main" p="4">
      {children}
    </Box>
  );
}