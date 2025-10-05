import { Box, Flex, Heading } from '@chakra-ui/react';

export function Header() {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Box>
        <Heading as="h1" size="lg">
          Symlinker Pro
        </Heading>
      </Box>
    </Flex>
  );
}