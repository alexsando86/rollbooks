import React, { useCallback, useState } from 'react';

import { Center, Fade, Flex, Input, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';

interface UserProps {
  employeeId: string;
  name: string;
}

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const [showMessage, setShowMessage] = useState(false);

  const router = useRouter();
  const { createUserMutation, loginMutation } = useUser();

  const handleChangeEmployeeId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmployeeId(e.target.value);

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleClickLogin = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      // const userInfo = { employeeId, password };
      alert(`로그인 정보: ${employeeId}`);

      const res = await fetch(`/api/datas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: employeeId }),
      });

      const result = await res.json();
      if (res.ok) {
        console.log('데이터 저장 성공!');
        console.log(result);
        setEmployeeId('');
        router.push(`/ui/Admin?employeeId=${employeeId}`);
      } else {
        console.log('데이터 저장 실패: ' + result.message);
      }

      // router.push('/ui/Admin');

      // const response = await axios.post('/api/auth', userInfo);
      // if (response.status === 200) {
      //   //
      // } else {
      //   setErrorMsg('잘못된 사번 혹은 비밀번호입니다. 다시 입력해주세요.');
      // }

      // 로그인 성공시 admin 유무에 따라 유저페이지 or 관리자페이지로 이동. 아래는 url 예시
      // 유저: /page/221244
      // 관리자: /page/221244/admin
      // router.push('/ui/admin');
    },
    [employeeId]
  );

  const handleClickLogin2 = async () => {
    const result = await loginMutation.mutateAsync({
      employeeId,
      password,
    });

    if (result.isLogin) {
      router.push(`/ui/Admin?employeeId=${employeeId}`);
    }

    setEmployeeId('');
    setPassword('');
  };

  // 사용자/관리자 계정 생성
  const handleClickCreateUser = (access: number) => {
    const USER = access === -1 ? '관리자' : '사용자';

    let userId = prompt(`${USER} 사번 입력`, '');
    // while (!userId) {
    //   alert('빈값이 있습니다. 다시 입력하세요.');
    //   userId = prompt(`${USER} 사번 입력`, '');
    // }

    let userPassword = prompt('설정할 비밀번호 입력', '');
    // while (!userPassword) {
    //   alert('빈값이 있습니다. 다시 입력하세요.');
    //   userPassword = prompt('설정할 비밀번호 입력', '');
    // }

    let userName = prompt('이름 입력', '');
    // while (!userName) {
    //   alert('빈값이 있습니다. 다시 입력하세요.');
    //   userName = prompt('이름 입력', '');
    // }

    if (!userId || !userPassword || !userName) {
      alert('빈값이 있습니다. 다시 입력하세요.');
      return;
    }

    alert(`설정한 계정 정보: [${userId}]${userName}`);

    createUserMutation.mutate({
      employeeId: userId ?? '',
      password: userPassword ?? '',
      name: userName ?? '',
      access,
    });

    createUserMutation.isSuccess && setShowMessage(true);
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

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
      <Flex
        flexDirection="column"
        position="relative"
        fontWeight="semibold"
        letterSpacing="tight"
      >
        <Flex mb="174px" fontSize="64px">
          WEB개발팀 출석{' '}
          <Text ml="12px" px="8px" boxShadow="inset 0 -30px 0 #DCF42C">
            Check!
          </Text>
        </Flex>
        {/* <form onSubmit={handleClickLogin}> */}
        <Flex data-label="input box" alignItems="center" color="#2F2F2F">
          <Text w="130px" fontSize="24px" fontWeight="400">
            사번
          </Text>
          <Input
            w="100%"
            h="84px"
            fontSize="36px"
            placeholder="000000"
            sx={{
              '::placeholder': {
                color: '#E9E9E9',
              },
            }}
            borderBottom="2px solid #2F2F2F"
            id="employeeId"
            name="employeeId"
            type="text"
            value={employeeId}
            onChange={handleChangeEmployeeId}
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
            minLength={8}
            required
            borderBottom="2px solid #2F2F2F"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChangePassword}
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
          onClick={handleClickLogin2}
        >
          로그인
        </Center>
        {/* </form> */}
        <Flex mt="20px" justifyContent="space-around">
          <Center
            as="button"
            color="#AEAEAE"
            fontSize="18px"
            borderBottom="1px solid #AEAEAE"
            onClick={() => handleClickCreateUser(0)}
          >
            사용자계정 만들기
          </Center>
          {/* 관리자계정 생성시 주석 해제 */}
          {/* <Center
            as="button"
            color="#AEAEAE"
            fontSize="18px"
            borderBottom="1px solid #AEAEAE"
            onClick={() => handleClickCreateUser(-1)}
          >
            관리자계정 만들기
          </Center> */}
        </Flex>
        {/* 계정 생성 상태메시지 */}
        <Center w="100%" position="absolute" bottom="-50px" fontSize="16px">
          {createUserMutation.isPending ? (
            <Fade in={showMessage} unmountOnExit>
              <Text opacity={showMessage ? 1 : 0} transition="opacity 0.5s">
                ... 계정 생성중
              </Text>
            </Fade>
          ) : (
            <Fade in={showMessage} unmountOnExit>
              <Text
                px={2}
                borderBottom="6px solid #DCF42C"
                opacity={showMessage ? 1 : 0}
                transition="opacity 1s"
              >
                계정이 생성되었습니다!
              </Text>
            </Fade>
          )}
        </Center>
      </Flex>
    </Flex>
  );
};

export default Login;
