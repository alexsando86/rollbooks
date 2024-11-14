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
  Button as ChakraButton,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export interface AttendanceData {
  id: string;
  name: string;
  createdAt: string;
}

const statusStyles = {
  출근: { bgColor: '#73fa5138', textColor: '#2BD600' },
  지각: { bgColor: '#FF313105', textColor: '#FF3131' },
};

// 공통 스타일 정의
const commonStyles = {
  height: '30px',
  color: '#2f2f2f',
  fontWeight: '600',
  backgroundColor: '#fff',
  border: '1px solid #2f2f2f',
  borderRadius: '24px',
  _hover: { bg: '#f5f5f5' },
};

// CustomButton 컴포넌트
const CustomButton = (props: any) => (
  <ChakraButton {...commonStyles} {...props} />
);

// CustomSelect 컴포넌트
const CustomSelect = (props: any) => (
  <Box position="relative">
    <Box
      as="select"
      px="16px"
      textAlign="center"
      cursor="pointer"
      appearance="none"
      {...commonStyles}
      {...props}
    />
  </Box>
);

interface IProps {
  value: string;
  isFirst?: boolean;
  isLast?: boolean;
  bgColor?: string;
  textColor?: string;
  isStatus?: boolean;
}

// TableCell 컴포넌트
const TableCell = ({
  value,
  isFirst = false,
  isLast = false,
  bgColor = '',
  textColor = '',
  isStatus = false,
}) => (
  <Td padding="0">
    <Box
      height="60px"
      my="8px"
      backgroundColor="#f6f6f6"
      color="#2f2f2f"
      borderRadius={`${isFirst ? '16px 0 0 16px' : ''} ${isLast ? '0 16px 16px 0' : ''}`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width={isStatus ? '100px' : ''}
        px="3"
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

export default function AdminPage() {
  const [data, setData] = useState<any>({ data: [] });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const router = useRouter();
  const { employeeId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/datas?id=${employeeId}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const getStatus = (date: string, time: string) => {
    const dayOfWeek = dayjs(date).day();
    const checkTime = dayjs(time, 'HH:mm:ss');
    const limitTime = dayjs('10:00', 'HH:mm:ss');

    return dayOfWeek >= 2 && dayOfWeek <= 4 && checkTime.isAfter(limitTime)
      ? '지각'
      : '출근';
  };

  // 선택된 월에 따라 데이터를 필터링
  const filteredRecords = selectedMonth
    ? data.records?.filter(
        (item: AttendanceData) =>
          dayjs(item.createdAt).format('YYYY-MM') === selectedMonth
      )
    : data.records || [];

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
              이름 ({employeeId})
            </Text>
            <Text mt="6px" fontSize="12px" color="#8D94A4">
              WEB개발팀
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex>
        <Box flex="none" position="relative" width="230px">
          <Text fontSize="5xl" fontWeight="bold" as="h1">
            출석관리
          </Text>
        </Box>
        <Box flex="1">
          <Box>
            <Text>날짜 필터</Text>
            <Flex mt="5px" gap="0 8px">
              <CustomSelect
                onChange={handleMonthChange}
                defaultValue="placeholder"
              >
                <option value="placeholder" disabled hidden>
                  Month
                </option>
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
              {/* <CustomButton>WEEK</CustomButton>
              <CustomButton>DAY</CustomButton> */}
              <CustomButton onClick={() => setSelectedMonth(null)}>
                초기화
              </CustomButton>
            </Flex>
          </Box>
          {/* <Box mt="20px">
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
          </Box> */}
          {filteredRecords?.length > 0 ? (
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
                {filteredRecords.map((item: AttendanceData, index: number) => {
                  const date = dayjs(item.createdAt).format('YYYY-MM-DD');
                  const time = dayjs(item.createdAt).format('HH:mm:ss');
                  const status = getStatus(date, time);
                  const style = statusStyles[status] || {};

                  return (
                    <Tr key={index}>
                      <TableCell value={employeeId} isFirst />
                      <TableCell value={data.name} />
                      <TableCell value={date} />
                      <TableCell value={time} />
                      <TableCell value="09:00:00" />
                      <TableCell value="-" />
                      <TableCell value="17:00:00" />
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
          ) : (
            <Text mt="40px" fontSize="xl" color="#2f2f2f" textAlign="center">
              선택한 월에 해당하는 데이터가 없습니다.
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
