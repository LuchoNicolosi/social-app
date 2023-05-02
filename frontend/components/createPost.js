import {
  Button,
  FormControl,
  Input,
  Flex,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormData from 'form-data';
import { useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { Modal, Space, Upload } from 'antd';
import { getBase64 } from '../util/image';

export const CreatePost = ({ token }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [contentError, setContentError] = useState(false);
  const [errors, setErrors] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [showUploadList, setShowUploadList] = useState(true);

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

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('imageUrl', image);
    }

    const res = await mutation.mutateAsync(formData);
    if (res.errorMessage) {
      setErrors(res.data);
      setContentError(!contentError);
      return;
    }
    setContentError(false);
    if (image) {
      setImage(image);
    }
    setContent('');
    setShowUploadList(false);
  };

  return (
    <Box w={{ base: 'full', md: 'xl' }}>
      <Flex
        borderRight={{ md: '1px' }}
        borderLeft={{ md: '1px' }}
        boxShadow="md"
        borderBottom="1px"
        borderColor="gray"
        p={6}
        justifyContent="center"
      >
        <Box px={10} w="full" as="form" onSubmit={handleSubmit}>
          <Flex mt={3}>
            <FormControl isInvalid={contentError}>
              <Input
                value={content}
                placeholder="¿What's going on?"
                isInvalid={contentError}
                errorBorderColor="crimson"
                id="content"
                name="content"
                variant="flushed"
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
          </Flex>
          <Flex mt={3}>
            <FormControl>
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
                  <Modal
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
                  </Modal>
                </Space>
              </Flex>
            </FormControl>
            <Flex alignSelf="flex-end">
              <Button type="submit">Post</Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
