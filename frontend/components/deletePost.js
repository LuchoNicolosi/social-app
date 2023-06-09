import { DeleteIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
export const DeletePost = ({ postId, token }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef();

  const handleDeletePost = async () => {
    setLoading(true);
    try {
      await fetch(process.env.SERVER_URL + '/api/v1/home/post/' + postId, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="ghost" color="red.400" w={{ base: 2 }} onClick={onOpen}>
        <DeleteIcon />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={loading}
                colorScheme="red"
                onClick={handleDeletePost}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
