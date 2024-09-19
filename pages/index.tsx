import { Fragment, useCallback, useEffect, useState } from 'react'
import { Box, Button, Input } from '@chakra-ui/react'

export default function Home() {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [datas, setDatas] = useState<any>()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const res = await fetch(`/api/datas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, email }),
    })

    const result = await res.json()
    if (res.ok) {
      setMessage('데이터 저장 성공!')
      setId('')
      setName('')
      setEmail('')
      setDatas(result)
    } else {
      setMessage('데이터 저장 실패: ' + result.message)
    }
  }

  const fetchData = async () => {
    const res = await fetch(`api/datas`)
    const result = await res.json()

    if (res.ok) {
      setDatas(result)
    } else {
      console.error('데이터 조회 실패:', result.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!datas) return

  return (
    <Box p={4}>
      {datas.data?.map((data: any, index: any) => {
        return (
          <Box key={index} borderBottom="1px solid #ccc" pb={2}>
            <Box>name: {data.name}</Box>
            <Box>email: {data.email}</Box>
            <Box key={index}>출근시간: {datas.serverTime}</Box>
          </Box>
        )
      })}

      <Box py={4}>
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              type="text"
              placeholder="id"
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
              placeholder="name"
              size="md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              w="100%"
              border="1px solid #efefef"
              m={2}
              p={2}
            />
          </Box>
          <Box>
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              w="100%"
              border="1px solid #efefef"
              m={2}
              p={2}
            />
          </Box>
          <Button colorScheme="blue" type="submit" mt={4} w="full">
            출근
          </Button>
        </form>
      </Box>

      <div>{message}</div>
    </Box>
  )
}
