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
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export interface AttendanceData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  date: string;
  time: string;
}

export default function AdminPage() {
  const [datas, setDatas] = useState<AttendanceData[]>([]);

  const mergeData = (
    apiData: AttendanceData[],
    lastEntry: AttendanceData | null,
    ssgMemberData: AttendanceData[]
  ) => {
    let combinedData = [...ssgMemberData];

    // lastEntry가 있으면 추가 (이미 있는 데이터인지 확인)
    if (lastEntry && !combinedData.some((data) => data.id === lastEntry.id)) {
      combinedData = [lastEntry, ...combinedData];
    }

    // API 데이터를 병합 (중복 제거)
    apiData.forEach((item) => {
      if (!combinedData.some((data) => data.id === item.id)) {
        combinedData.push(item);
      }
    });

    setDatas(combinedData);
    localStorage.setItem('ssgMember', JSON.stringify(combinedData));
  };

  // API에서 데이터 불러오기
  const fetchData = async () => {
    const res = await fetch('/api/datas');
    const result = await res.json();
    return res.ok ? result.data : [];
  };

  useEffect(() => {
    const loadData = async () => {
      const ssgMemberStr = localStorage.getItem('ssgMember');
      const ssgMemberData = ssgMemberStr ? JSON.parse(ssgMemberStr) : [];

      const lastEntryStr = localStorage.getItem('lastEntry');
      const lastEntry = lastEntryStr ? JSON.parse(lastEntryStr) : null;

      const apiData = await fetchData();

      mergeData(apiData, lastEntry, ssgMemberData);

      if (lastEntry) {
        localStorage.removeItem('lastEntry');
      }
    };

    loadData();
  }, []);

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
              이름 (사번)
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
          <Box height="140px">필터 추가</Box>
          <Table
            color="#2f2f2f"
            width="100%"
            textAlign="center"
            fontSize="20px"
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
              {datas.map((data, index) => {
                const status = getStatus(data.date, data.time);
                const style = statusStyles[status] || {};
                return (
                  <Tr key={index}>
                    <Td padding="0">
                      <Box
                        height="60px"
                        my="8px"
                        backgroundColor="#f6f6f6"
                        borderTopLeftRadius="16px"
                        borderBottomLeftRadius="16px"
                      >
                        {data.id}
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box height="60px" my="8px" backgroundColor="#f6f6f6">
                        {data.name}
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box height="60px" my="8px" backgroundColor="#f6f6f6">
                        {data.date}
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box height="60px" my="8px" backgroundColor="#f6f6f6">
                        {data.time}
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box height="60px" my="8px" backgroundColor="#f6f6f6">
                        09:00
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box height="60px" my="8px" backgroundColor="#f6f6f6">
                        -
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box height="60px" my="8px" backgroundColor="#f6f6f6">
                        17:00
                      </Box>
                    </Td>
                    <Td padding="0">
                      <Box
                        height="60px"
                        my="8px"
                        backgroundColor="#f6f6f6"
                        borderTopRightRadius="16px"
                        borderBottomRightRadius="16px"
                      >
                        <Box
                          backgroundColor={style.bgColor}
                          color={style.textColor}
                          borderRadius="18px"
                        >
                          {status}
                        </Box>
                      </Box>
                    </Td>
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
