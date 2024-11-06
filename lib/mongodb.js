// lib/mongodb.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB URI를 환경 변수로 설정
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 단일 연결을 유지하여 Hot Reload 시 중복 연결 방지
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 프로덕션 환경에서는 클라이언트를 새로 생성
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
