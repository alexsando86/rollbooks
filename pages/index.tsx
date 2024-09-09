import { Fragment, useCallback, useEffect, useState } from 'react';
import * as dayjs from 'dayjs'

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/datas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage('데이터 저장 성공!');
      setName('');
      setEmail('');
    } else {
      setMessage('데이터 저장 실패: ' + result.message);
    }
    console.log(result)
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`api/datas`);
      const result = await res.json();
      if (res.ok) {
        setData(result.data);
      } else {
        console.error('데이터 조회 실패:', result.message);
      }
    };

    fetchData();
  }, [data]);

  if(!data) return;
  
  return (
    <div>
      {
        data.map((list, index) => {
          return (
            <div key={`${list.id}-${index}`} style={{marginBottom:'20px'}}>
              <div>{list.name}</div>
              <div>{list.email}</div>
              <div>Date: {list.createdAt}</div>
            </div>
          )
        })
      }
      
      
      <form onSubmit={handleSubmit}>
        <div><input type="text" placeholder='name' value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" /></div>
        <div><input type="email"  placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" /></div>
        <button type="submit">출근</button>
      </form>
        
      <div>{message}</div>
      
      
    </div>
  );
}
