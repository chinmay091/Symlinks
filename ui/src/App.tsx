import { useEffect, useState } from 'react';
import { Header } from './components/Layout/Header';
import { MainContent } from './components/Layout/MainContent';
import { RulesList } from './components/RulesList';
import { Rule } from './types';
import {
  Alert,
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { RuleForm } from './components/RuleForm';
import { AlertCircle } from 'lucide-react';

function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        if (!window.api?.getRules) {
          throw new Error('API not available. Make sure Electron preload is configured.');
        }
        const fetchedRules = await window.api.getRules();
        setRules(fetchedRules);
      } catch (err) {
        console.error('Failed to fetch rules:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // ADD THIS FUNCTION to handle the save logic
  const handleSaveRule = async (newRule: Rule) => {
    // Create a new list with the old rules plus the new one
    const newRulesList = [...rules, newRule];

    // Call the API to save the entire list to the file
    const result = await window.api.saveRules(newRulesList);

    if (result.success) {
      // If saving was successful, update the UI state to show the new list
      setRules(newRulesList);
    } else {
      // Here you could show an error alert to the user
      console.error("Failed to save the new rule:", result.error);
    }
  };

  const handleDeleteRule = async (indexToDelete: number) => {
    try {
      // Create a new list without the deleted rule
      const newRulesList = rules.filter((_, index) => index !== indexToDelete);

      // Call the API to save the updated list
      const result = await window.api.saveRules(newRulesList);

      if (result.success) {
        // Update the UI state
        setRules(newRulesList);
      } else {
        console.error("Failed to delete the rule:", result.error);
        setError(`Failed to delete the rule: ${result.error}`);
      }
    } catch (err) {
      console.error("Error deleting rule:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
      );
    }

    if (error) {
      return (
        <Alert.Root status="error">
          <AlertCircle />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      );
    }

    if (rules.length > 0) {
      return <RulesList rules={rules} onDelete={handleDeleteRule} />;
    }

    return <Text>No rules found in backend/rules.json</Text>;
  };

  return (
    <>
      <Header />
      <MainContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="md">
            Active Rules
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Add New Rule
          </Button>
        </Box>
        {renderContent()}
      </MainContent>
      <RuleForm isOpen={open} onClose={onClose} onSave={handleSaveRule} />
    </>
  );
}

export default App;