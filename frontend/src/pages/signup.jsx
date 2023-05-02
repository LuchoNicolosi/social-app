import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { Modal, Space, Upload } from 'antd';
import { getBase64 } from '../../util/image';

const Signup = () => {
  const [isToggle, setToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState();

  const [errors, setErrors] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [userNameError, setUserNameErrorr] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [imageUrlError, setImageUrlError] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [showUploadList, setShowUploadList] = useState(true);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const { toggleColorMode } = useColorMode();
  const bgButton = useColorModeValue('gray.100', 'gray.800');
  const colorButton = useColorModeValue('gray.800', 'white');
  const router = useRouter();
  const bfForm = useColorModeValue('gray.100', 'gray.700');

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
    formData.append('email', email);
    formData.append('name', name);
    formData.append('userName', userName);
    formData.append('password', password);
    formData.append('imageUrl', imageUrl);

    const res = await fetch('http://localhost:8080/api/v1/auth/signup', {
      method: 'POST',
      body: formData,
    });

    if (res.status !== 200) {
      const errorsResponse = await res.json();
      if (errorsResponse.data) {
        setErrors(errorsResponse.data);
        errors.map((e) => {
          if (e.path === 'email') {
            setEmailError(!emailError);
          } else if (e.path === 'name') {
            setNameError(!nameError);
          } else if (e.path === 'userName') {
            setUserNameErrorr(!userNameError);
          } else if (e.path === 'password') {
            setPasswordError(!passwordError);
          }
        });
        console.log(errors.forEach((e) => console.log(e)));
      } else if (!errorsResponse.data) {
        setImageUrlError(errorsResponse.errorMessage);
      }
    } else {
      router.push('/login');
    }
  };
  const handleToggle = () => {
    setToggle(!isToggle);
    return toggleColorMode();
  };

  return (
    <Flex justifyContent="center" h="100vh" alignItems="center">
      <Flex
        position="absolute"
        top="0"
        right="0"
        p={{ base: '0.5em', md: '1.5em' }}
      >
        <Button
          onClick={handleToggle}
          bg={bgButton}
          color={colorButton}
          colorScheme="none"
        >
          {isToggle ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Flex>
      <Flex
        flexDir="column"
        p={12}
        rounded={6}
        bg={bfForm}
        onSubmit={handleSubmit}
        as="form"
      >
        <Heading mb={6} textAlign="center">
          Sign up
        </Heading>

        <FormControl mb={3} isInvalid={emailError}>
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            name="email"
            isInvalid={emailError}
            errorBorderColor="crimson"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jhondoe@socialapp.com"
            variant="filled"
            type="email"
          />
          {emailError && (
            <FormErrorMessage>
              {errors.map((e) => {
                if (e.path === 'email') {
                  return <>{e.msg}</>;
                } else if (e.value === '' && e.path === 'email') {
                  return <>{e.msg}</>;
                }
              })}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl mb={3} isInvalid={nameError}>
          <FormLabel>Name</FormLabel>
          <Input
            id="name"
            name="name"
            isInvalid={nameError}
            errorBorderColor="crimson"
            placeholder="Your name"
            variant="filled"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && (
            <FormErrorMessage>
              {errors.map((e) => {
                if (e.path === 'name') {
                  return <>{e.msg}</>;
                } else if (e.value === '' && e.path === 'name') {
                  return <>{e.msg}</>;
                }
              })}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl mb={3} isInvalid={imageUrlError}>
          <FormLabel>Photo profile</FormLabel>
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
              listType="picture-circle"
              maxCount={1}
              id="imageUrl"
              name="imageUrl"
              onChange={(e) => {
                setShowUploadList(true);
                setImageUrl(e.file.originFileObj);
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
          {imageUrlError && (
            <FormErrorMessage>{imageUrlError}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl mb={3} isInvalid={userNameError}>
          <FormLabel>Username</FormLabel>
          <Input
            id="userName"
            name="userName"
            isInvalid={userNameError}
            errorBorderColor="crimson"
            placeholder="@jhondoe"
            variant="filled"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
          {userNameError && (
            <FormErrorMessage>
              {errors.map((e) => {
                if (e.path === 'userName') {
                  return <>{e.msg}</>;
                } else if (e.value === '' && e.path === 'userName') {
                  return <>{e.msg}</>;
                }
              })}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl mb={6} isInvalid={passwordError}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              name="password"
              isInvalid={passwordError}
              errorBorderColor="crimson"
              placeholder="**********"
              variant="filled"
              type={show ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {passwordError && (
            <FormErrorMessage>
              {errors.map((e) => {
                if (e.path === 'password') {
                  return <>{e.msg}</>;
                } else if (e.value === '' && e.path === 'password') {
                  return <>{e.msg}</>;
                }
              })}
            </FormErrorMessage>
          )}
        </FormControl>

        <Button mb={3} colorScheme="teal" type="submit">
          Sign up
        </Button>
        <Box>
          Do you already have an account?<Link href="/login"> Log in!</Link>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Signup;
