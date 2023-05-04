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
  FormErrorMessage,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormData from 'form-data';
import { BsImage } from 'react-icons/bs';
import { Modal as ModalAntd, Space, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { getBase64 } from '../util/image';

export const EditPost = ({ postId, token, post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [contentError, setContentError] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [showUploadList, setShowUploadList] = useState(true);

  useEffect(() => {
    setContent(post.content);
    if (post.imageUrl) {
      setImage(post.imageUrl);
    }
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData) =>
      fetch(process.env.SERVER_URL + '/api/v1/home/post/' + postId, {
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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('imageUrl', image || null);

    const res = await mutation.mutateAsync(formData);
    if (res.errorMessage) {
      setErrors(res.data);
      setContentError(!contentError);
      return;
    }
    setLoading(false);
    setContent(content);
    setImage(image || null);
    onClose();
  };

  return (
    <Box>
      <Box>
        <Button w={{ base: 2 }} onClick={onOpen}>
          <EditIcon />
        </Button>
      </Box>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Edit your post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={contentError}>
              <FormLabel>Content</FormLabel>
              <Input
                id="content"
                name="content"
                value={content}
                isInvalid={contentError}
                errorBorderColor="crimson"
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              {contentError && (
                <FormErrorMessage>
                  {errors.map((e) => {
                    if (e.value === '' && e.path === 'content') {
                      return <>{e.msg}</>;
                    } else if (e.path === 'content') {
                      return <>{e.msg}</>;
                    }
                  })}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <Flex ml={3} h="full" alignItems="center">
                <Space
                  direction="vertical"
                  style={{
                    width: '100%',
                  }}
                  size="large"
                >
                  <Upload
                    onPreview={handlePreview}
                    showUploadList={showUploadList}
                    listType="picture-card"
                    maxCount={1}
                    id="imageUrl"
                    name="imageUrl"
                    onChange={(e) => {
                      setShowUploadList(true);
                      setImage(e.file.originFileObj);
                    }}
                  >
                    <Button _hover={{ bg: 'transparent' }} variant="ghost">
                      <BsImage />
                    </Button>
                  </Upload>
                  <ModalAntd
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: '100%',
                      }}
                      src={previewImage}
                    />
                  </ModalAntd>
                </Space>
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} type="submit" colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
