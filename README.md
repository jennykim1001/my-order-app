# 오늘의 주문

React 기초 학습을 위한 실습 프로젝트입니다. 손님이 메뉴를 담아 주문하고, 로그인한 사용자는 본인 주문을 조회할 수 있습니다.

## 기술 스택

- Vite + React (JavaScript, `.jsx`)
- Tailwind CSS + shadcn/ui (컴포넌트 스타일 기반)
- Supabase (Auth + Database, 백엔드 로직은 RLS 정책으로 처리)
- react-router-dom (라우팅)
- 경로 별칭 `@/` → `src/` (`jsconfig.json`, `vite.config.js`)

## 환경 변수

`.env` (git에 커밋되지 않음, `.env.example` 참고 없이 아래 두 값을 직접 채워야 함)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`src/lib/supabase.js`에서 이 값으로 Supabase 클라이언트를 만들어 export합니다. anon(publishable) key만 사용하며, service_role key는 코드/`.env`에 두지 않습니다.

## 라우트 구성

| 경로 | 페이지 | 설명 |
|---|---|---|
| `/` | `OrderPage` | 메뉴 목록, 장바구니, 주문서. 로그인 상태면 `orders`에 insert, 비로그인이면 `/auth`로 유도 |
| `/auth` | `AuthPage` | shadcn Tabs로 로그인/회원가입 전환. 로그인은 `signInWithPassword`, 회원가입은 `signUp` |
| `/my` | `MyOrdersPage` | 로그인한 사용자의 주문을 최신순으로 조회 (품목, 금액, 상태 Badge, 주문 시각) |
| `/admin` | `AdminPage` | 준비 중 |

## 로그인 세션 관리

`src/lib/AuthContext.jsx`의 `AuthProvider`가 앱 최상단(`main.jsx`)을 감싸고 있습니다.

- 앱 시작 시 `supabase.auth.getSession()`으로 현재 세션을 한 번 불러옴
- `supabase.auth.onAuthStateChange`로 로그인/로그아웃/토큰 갱신을 자동 반영
- `useAuth()` 훅으로 어느 컴포넌트에서든 `user`, `session`, `isLoading`, `signOut()`을 사용 가능
- `src/components/Header.jsx`: 비로그인이면 `[로그인]`, 로그인이면 이메일 + `[내 주문]` + `[로그아웃]` 표시

## 데이터베이스 & RLS

`orders` 테이블 (Supabase, `supabase/migrations/0001_orders.sql` 참고)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigint | identity 기본키 |
| user_id | uuid | `auth.users(id)` 참조 |
| pickup_time | text | 픽업 희망 시간 |
| items | text | `"메뉴명 xN, 메뉴명 xN"` 형태의 한 줄 텍스트 |
| total_price | bigint | 합계 금액 |
| status | text | 기본값 `'접수'` |
| created_at | timestamptz | 기본값 `now()` |

RLS 정책 (로그인한 사용자는 본인 것만):

- INSERT: `with check (auth.uid() = user_id)` — 본인 명의로만 주문 생성 가능
- SELECT: `using (auth.uid() = user_id)` — 본인 주문만 조회 가능 (조회 쿼리에 별도 필터 없이도 자동 적용)

## 개발

```
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint      # oxlint
```

## 폴더 구조

```
src/
  components/    # Header, MenuCard 등 공용 컴포넌트
  components/ui/  # shadcn 스타일 UI 컴포넌트 (button, card, input, label, tabs, badge)
  data/          # 메뉴 등 정적 데이터
  lib/           # supabase 클라이언트, AuthContext, utils
  pages/         # 라우트별 페이지 컴포넌트
```
