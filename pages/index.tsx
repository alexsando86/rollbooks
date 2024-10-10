import { Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

export default function Home() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [datas, setDatas] = useState<any>({ data: [] });

  const today = dayjs(new Date()).format('YYYY-MM-DD');
  const time = dayjs(new Date()).format('HH:mm:ss');
  const router = useRouter();

  const addEntry = (entry: {
    id: string;
    name: string;
    date: string;
    time: string;
  }) => {
    const existingData = localStorage.getItem('ssgMember');
    const newEntry = { ...entry, createdAt: today }; // 새로 추가할 데이터 객체

    let updatedData;
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      updatedData = [newEntry, ...parsedData]; // 새로운 데이터를 맨 앞에 추가
    } else {
      updatedData = [newEntry]; // 기존 데이터가 없으면 새 배열 생성
    }

    // updatedData를 localStorage에 저장
    localStorage.setItem('ssgMember', JSON.stringify(updatedData));
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      const res = await fetch(`/api/${today}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, today, time }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('데이터 저장 성공!');
        setId('');
        setName('');

        // localStorage에 ssgMember 업데이트
        addEntry({ id, name, date: today, time });

        router.push('/ui/admin');
      } else {
        setMessage('데이터 저장 실패: ' + result.message);
      }
    },
    [id, name, today, time]
  );

  const fetchData = async () => {
    const res = await fetch(`api/datas`);
    const result = await res.json();

    if (res.ok) {
      setDatas(result);
    } else {
      console.error('데이터 조회 실패:', result.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!datas) return;

  return (
    <Box p={4}>
      {/* {datas.data?.map((data: any, index: any) => {
        return (
          <Box key={index} borderBottom="1px solid #ccc" pb={2}>
            <Box>name: {data.name}</Box>
            <Box key={index}>출근시간: {data.createdAt}</Box>
          </Box>
        );
      })} */}

      <Box py={4}>
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              type="text"
              placeholder="사번"
              value={id}
              onChange={(e) => setId(e.target.value)}
              w="100%"
              border="1px solid #efefef"
              m={2}
              p={2}
            />
          </Box>
          <Box>
            <Input
              type="text"
              placeholder="이름"
              size="md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              w="100%"
              border="1px solid #efefef"
              m={2}
              p={2}
            />
          </Box>
          <Button colorScheme="blue" type="submit" mt={4} w="full">
            내 출근기록 보기
          </Button>
        </form>
      </Box>

      <div>{message}</div>
    </Box>
  );
}
