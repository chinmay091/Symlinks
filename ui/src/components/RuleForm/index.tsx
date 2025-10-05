import {
  Button,
  Input,
  VStack,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  Field,
  Group,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Rule } from '../../types';

interface RuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRule: Rule) => void;
}

export function RuleForm({ isOpen, onClose, onSave }: RuleFormProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [extensions, setExtensions] = useState('');

  // The Save button will be disabled if these fields are empty.
  const isFormValid = source.trim() !== '' && destination.trim() !== '';

  const handleSelectFolder = async (setter: React.Dispatch<React.SetStateAction<string>>) => {
    const path = await window.api.selectFolder();
    if (path) {
      setter(path);
    }
  };

  const handleSave = () => {
    const allowedExtensions = extensions
      .split(',')
      .map(ext => ext.trim())
      // Ensure extensions are valid (not empty and start with a dot)
      .filter(ext => ext.length > 1 && ext.startsWith('.'));

    // Call onSave with the complete rule object
    onSave({ source, destination, allowedExtensions });
    
    // Clear fields and close modal
    setSource('');
    setDestination('');
    setExtensions('');
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Rule</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        
        <DialogBody>
          <VStack gap={4} align="stretch">
            <Field.Root required>
              <Field.Label>Source Folder</Field.Label>
              <Group attached>
                <Input
                  placeholder="e.g., C:\Users\YourUser\Downloads"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  flex="1"
                />
                <Button size="sm" onClick={() => handleSelectFolder(setSource)}>
                  Browse
                </Button>
              </Group>
            </Field.Root>

            <Field.Root required>
              <Field.Label>Destination Folder</Field.Label>
              <Group attached>
                <Input
                  placeholder="e.g., D:\My Archives\Documents"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  flex="1"
                />
                <Button size="sm" onClick={() => handleSelectFolder(setDestination)}>
                  Browse
                </Button>
              </Group>
            </Field.Root>

            <Field.Root>
              <Field.Label>Allowed File Extensions (Optional)</Field.Label>
              <Input
                placeholder="e.g., .jpg, .png, .gif"
                value={extensions}
                onChange={(e) => setExtensions(e.target.value)}
              />
              <Field.HelperText>
                Comma-separated. If kept blank, all files will be moved.
              </Field.HelperText>
            </Field.Root>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}