import { Rule } from '../../types'
import { Card, Flex, Text, IconButton } from '@chakra-ui/react'
import { ArrowRight, Trash } from 'lucide-react'

interface RuleItemProps {
  rule: Rule;
  onDelete?: () => void;
}

export function RuleItem({ rule, onDelete }: RuleItemProps) {
  return (
    <Card.Root variant="outline" bg="gray.50">
      <Card.Body>
        <Flex align="center">
          <Flex direction="column" flex="1" truncate>
            <Text fontSize="sm" color="gray.600">
              FROM
            </Text>
            <Text fontWeight="medium" truncate title={rule.source}>
              {rule.source}
            </Text>
          </Flex>
          <ArrowRight color="teal" size={20} style={{ margin: '0 1.5rem' }} />
          <Flex direction="column" flex="1" truncate>
            <Text fontSize="sm" color="gray.600">
              TO
            </Text>
            <Text fontWeight="medium" truncate title={rule.destination}>
              {rule.destination}
            </Text>
          </Flex>

          <IconButton
            aria-label="Delete rule"
            variant="ghost"
            colorScheme="red"
            onClick={onDelete}
            ml={4}
          >
            <Trash size={18} />
          </IconButton>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}