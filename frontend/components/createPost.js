import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Box,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormData from 'form-data';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const CreatePost = ({ token }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState('');
  const [image, setImage] = useState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await fetch('http://localhost:8080/api/v1/home/post', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['posts'], data.post);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('imageUrl', image);

    try {
      await mutation.mutateAsync(formData);
      onClose();
    } catch (error) {
      throw new Error('Something went wrong!');
    }
  };

  return (
    <>
      <Flex
        position="fixed"
        bottom="0"
        right="0"
        m={6}
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Button onClick={onOpen}>Crear Post</Button>
        </Box>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent as="form" onSubmit={handleSubmit}>
            <ModalHeader>Create your post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Content</FormLabel>
                <Input
                  placeholder="Enter the content"
                  id="content"
                  name="content"
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Image</FormLabel>
                <Input
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
