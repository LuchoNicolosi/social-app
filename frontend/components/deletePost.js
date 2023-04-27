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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
export const DeletePost = ({ postId, token }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await fetch('http://localhost:8080/api/v1/home/post/' + postId, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
        body: formData,
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.refetchQueries(['posts']);
    },
  });

  const handleDeletePost = async () => {
    try {
      await mutation.mutateAsync();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>
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
              <Button colorScheme="red" onClick={handleDeletePost} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
