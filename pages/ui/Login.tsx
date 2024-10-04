import React from 'react';

import { Center, Flex, Box, Input, Text } from '@chakra-ui/react';

const Login = () => {
  return (
    <Flex
      pt="calc(100vh/4)"
      justifyContent="center"
      alignItems="center"
      fontFamily="pretendard"
    >
      {/* 그래픽 */}
      <Flex w="750px" gap="50px" flexWrap="wrap">
        <Center
          borderRadius="full"
          boxSize="300px"
          backgroundColor="#2F2F2F"
        ></Center>
        <Center
          borderRadius="full"
          boxSize="300px"
          backgroundColor="#DCF42C"
        ></Center>
        <Center
          borderRadius="full"
          boxSize="300px"
          backgroundColor="#D9DDE5"
        ></Center>
        <Center
          borderRadius="full"
          boxSize="300px"
          border="5px dashed #2F2F2F"
        ></Center>
      </Flex>
      {/* 로그인 부분 */}
      <Flex flexDirection="column" fontWeight="semibold" letterSpacing="tight">
        <Flex mb="174px" fontSize="64px">
          WEB개발팀 출석{' '}
          <Text ml="12px" px="8px" boxShadow="inset 0 -30px 0 #DCF42C">
            Check!
          </Text>
        </Flex>
        <Flex data-label="input box" alignItems="center" color="#2F2F2F">
          <Text w="130px" fontSize="24px" fontWeight="400">
            사번
          </Text>
          <Input
            w="100%"
            h="84px"
            fontSize="36px"
            type="text"
            placeholder="112233"
            borderBottom="2px solid #2F2F2F"
          ></Input>
        </Flex>
        <Flex
          data-label="input box"
          mt="28px"
          alignItems="center"
          color="#2F2F2F"
        >
          <Text w="130px" fontSize="24px" fontWeight="400">
            비밀번호
          </Text>
          <Input
            w="100%"
            h="84px"
            fontSize="36px"
            type="password"
            minLength={8}
            required
            borderBottom="2px solid #2F2F2F"
          ></Input>
        </Flex>
        <Center
          as="button"
          w="100%"
          h="80px"
          mt="44px"
          color="white"
          bgColor="#2F2F2F"
          fontSize="24px"
          borderRadius="40px"
        >
          로그인
        </Center>
      </Flex>
    </Flex>
  );
};

export default Login;
