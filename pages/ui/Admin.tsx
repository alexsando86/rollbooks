import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Select as ChakraSelect,
  Button as ChakraButton,
  styled,
} from '@chakra-ui/react';

import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export interface AttendanceData {
  id: string;
  name: string;
  createdAt: string;
}

interface IProps {
  value: string;
  isFirst?: boolean;
  isLast?: boolean;
  bgColor?: string;
  textColor?: string;
  isStatus?: boolean; // 상태 셀인지 여부를 나타내는 속성
}

// 커스텀 스타일이 적용된 Button
const CustomButton = styled(ChakraButton, {
  baseStyle: {
    height: '30px',
    color: '#2f2f2f',
    fontWeight: '600',
    backgroundColor: '#fff',
    border: '1px solid #2f2f2f',
    borderRadius: '24px',
    _hover: { bg: '#f5f5f5' },
  },
});

// 커스텀 스타일이 적용된 Select
const CustomSelect = styled(ChakraSelect, {
  baseStyle: {
    height: '30px',
    color: '#2f2f2f',
    fontWeight: '600',
    backgroundColor: '#fff',
    border: '1px solid #2f2f2f',
    borderRadius: '24px',
    appearance: 'none',
  },
});

const TableCell = ({
  value,
  isFirst = false,
  isLast = false,
  bgColor = '',
  textColor = '',
  isStatus = false,
}: IProps) => (
  <Td padding="0">
    <Box
      height="60px"
      my="8px"
      backgroundColor="#f6f6f6"
      color="#2f2f2f"
      borderTopLeftRadius={isFirst ? '16px' : '0'}
      borderBottomLeftRadius={isFirst ? '16px' : '0'}
      borderTopRightRadius={isLast ? '16px' : '0'}
      borderBottomRightRadius={isLast ? '16px' : '0'}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width={isStatus ? '100px' : ''}
        padding="3px 12px"
        backgroundColor={bgColor}
        color={textColor}
        fontWeight={isStatus ? 'bold' : 'normal'}
        borderRadius={isStatus ? '18px' : '0'}
      >
        {value}
      </Box>
    </Box>
  </Td>
);

export default function AdminPage({}) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  // const [data, setData] = useState<AttendanceData[]>([]);
  // const [id, setId] = useState('');
  // const [name, setName] = useState('');

  const [data, setData] = useState<any>({ data: [] });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null); // 선택된 달을 저장할 상태

  // const id = data.id;

  // API에서 데이터 불러오기
  const fetchData = async () => {
    // DB에 yearMonth 데이터가 있을때 조회 가능.
    // const res = await fetch(`/api/datas?yearMonth=${yearMonth}&id=${184744}`);

    const res = await fetch(`/api/datas?id=${184744}`);
    // const res = await fetch(url);
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

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  // 화, 수, 목 10시 이후면 지각
  const getStatus = (date: string, time: string) => {
    const dayOfWeek = dayjs(date).day();
    const checkTime = dayjs(time, 'HH:mm');
    const limitTime = dayjs('10:00', 'HH:mm');

    return dayOfWeek >= 2 && dayOfWeek <= 4 && checkTime.isAfter(limitTime)
      ? '지각'
      : '출근';
  };

  const statusStyles = {
    출근: {
      bgColor: '#73fa5138',
      textColor: '#2BD600',
    },
    지각: {
      bgColor: '#FF313105',
      textColor: '#FF3131',
    },
  };

  return (
    <Box p={20}>
      <Flex>
        <Flex alignItems="center" flex="none" ml="auto">
          <Box
            width="60px"
            height="60px"
            borderRadius="50%"
            backgroundColor="#f9f9f9"
            mr="12px"
          >
            이미지
          </Box>
          <Box lineHeight="1.2">
            <Text fontSize="20px" fontWeight="bold">
              이름 ({data.id})
            </Text>
            <Text mt="6px" fontSize="12px" color="#8D94A4">
              WEB개발팀
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          as="h1"
          _after={{
            content: `""`,
            mx: '10px',
            display: 'inline-block',
            width: '1px',
            height: '20px',
            backgroundColor: '#2f2f2f',
          }}
        >
          출석관리
        </Text>
        <Box flex="1">
          <Box>
            <Box>
              <Text>날짜 필터</Text>
              <Flex mt="5px" gap="0 8px">
                <CustomSelect
                  variant="unstyled"
                  placeholder="Month"
                  mt={2}
                  onChange={handleMonthChange}
                >
                  {[...Array(12).keys()].map((_, i) => {
                    const month = dayjs()
                      .startOf('year')
                      .add(i, 'month')
                      .format('YYYY-MM');
                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </CustomSelect>
                <CustomButton>WEEK</CustomButton>
                <CustomButton>DAY</CustomButton>
                <CustomButton onClick={() => setSelectedMonth(null)}>
                  초기화
                </CustomButton>
              </Flex>
            </Box>
            <Box mt="20px">
              <Text>목록 정렬 필터</Text>
              <Flex mt="5px" gap="0 8px">
                <CustomButton>시간 오름차순</CustomButton>
                <CustomButton>시간 내림차순</CustomButton>
                <CustomButton>이름 오름차순</CustomButton>
                <CustomButton>이름 내림차순</CustomButton>
              </Flex>
            </Box>
            <Box mt="20px">
              <Text>조건 필터</Text>
              <Flex mt="5px" gap="0 8px">
                <CustomButton>전체보기</CustomButton>
                <CustomButton>지각자</CustomButton>
                <CustomButton>휴가자</CustomButton>
              </Flex>
            </Box>
          </Box>
          <Table
            width="100%"
            mt="40px"
            textAlign="center"
            fontSize="20px"
            color="#2f2f2f"
          >
            <Thead>
              <Tr>
                <Th>사번</Th>
                <Th>이름</Th>
                <Th>날짜</Th>
                <Th>출근시간</Th>
                <Th>예상출근시간</Th>
                <Th>퇴근시간</Th>
                <Th>예상퇴근시간</Th>
                <Th>상태</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.records?.map((item: AttendanceData, index) => {
                const date = dayjs(item.createdAt).format('YYYY-MM-DD');
                const time = dayjs(item.createdAt).format('HH:mm:ss');
                const status = getStatus(date, time);
                const style = statusStyles[status] || {};

                return (
                  <Tr key={index}>
                    <TableCell value={data.id} isFirst />
                    <TableCell value={data.name} />
                    <TableCell value={date} />
                    <TableCell value={time} />
                    <TableCell value="09:00" />
                    <TableCell value="-" />
                    <TableCell value="17:00" />
                    <TableCell
                      value={status}
                      bgColor={style.bgColor}
                      textColor={style.textColor}
                      isLast
                      isStatus
                    />
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}
