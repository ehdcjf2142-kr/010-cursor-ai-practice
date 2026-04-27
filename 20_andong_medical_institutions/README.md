# 안동시 의료기관 현황 웹사이트 (초보자용)

## 1) 설치

```bash
npm install
```

## 2) 환경변수 설정

`.env.example` 파일을 복사해 `.env` 파일을 만들고, 아래처럼 입력하세요.

```env
DATA_GO_KR_API_KEY=발급받은일반인증키
PORT=3000
```

## 3) 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000` 접속

## 4) 기능

- 안동시 의료기관 목록 조회
- 기관명/주소/전화번호/구분 표시
- 검색 기능(기관명/주소/전화번호/구분 포함)

## 5) 구조

- `server.js`: 공공데이터 API 호출 + XML 파싱 + JSON 응답
- `public/index.html`: 화면
- `public/app.js`: 목록 로딩/검색
- `public/style.css`: 스타일
