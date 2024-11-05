import { Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

export default function Home() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any>({ data: [] });

  const yearMonth = dayjs().format('YYYY-MM');

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      const res = await fetch(`/api/datas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('데이터 저장 성공!');
        setId('');
        setName('');
      } else {
        setMessage('데이터 저장 실패: ' + result.message);
      }
    },
    [id]
  );

  const fetchData = async () => {
    // DB에 yearMonth 데이터가 있을때 조회 가능.
    // const res = await fetch(`/api/datas?yearMonth=${yearMonth}&id=${184744}`);

    const res = await fetch(`/api/datas?id=${184744}`);
    const result = await res.json();

    if (res.ok) {
      setData(result);
    } else {
      console.error('데이터 조회 실패:', result.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return;

  return (
    <Box p={4}>
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

      {data.id === '184744' && <Text>육선도</Text>}
      {data.records?.map((item, index) => (
        <Box key={index}>
          {dayjs(item.createdAt).format('YYYY-MM-DD-HH:mm:ss')}
        </Box>
      ))}
    </Box>
  );
}
