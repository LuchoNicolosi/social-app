import { EditIcon } from '@chakra-ui/icons';
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

export const EditPost = ({ postId, token }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState('');
  const [image, setImage] = useState();

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/home/post/' + postId, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then(({ post }) => {
        setContent(post.content);
        setImage(post.imageUrl);
      })
      .catch((err) => console.log(err));
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData) =>
      fetch('http://localhost:8080/api/v1/home/post/' + postId, {
        method: 'PUT',
        headers: {
          Authorization: token,
        },
        body: formData,
      }).then((res) => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['posts'], data);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('imageUrl', image);

    try {
      await mutation.mutateAsync(formData);
      setContent(content);
      setImage(image);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box>
        <Button onClick={onOpen}>
          <EditIcon />
        </Button>
      </Box>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Edit your post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Input
                id="content"
                name="content"
                value={content}
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
    </Box>
  );
};
