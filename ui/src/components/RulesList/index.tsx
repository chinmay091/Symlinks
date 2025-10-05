import { Rule } from '../../types'
import { Box } from '@chakra-ui/react'
import { RuleItem } from './RuleItem'

interface RulesListProps {
  rules: Rule[];
  onDelete: (index: number) => void;
}

export function RulesList({ rules, onDelete }: RulesListProps) {
  return (
    <Box>
      {rules.map((rule, index) => (
        <RuleItem key={index} rule={rule} onDelete={() => onDelete(index)} />
      ))}
    </Box>
  );
}
