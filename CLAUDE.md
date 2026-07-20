# CLAUDE.md — 핫한 디저트 가게 "오늘의 주문" 서비스

## 프로젝트 개요
React 기초 학습을 위한 실습 프로젝트. 손님이 메뉴를 담아 주문하고,
로그인한 사용자는 본인 주문을 조회할 수 있는 서비스.

## 기술 규칙 (항상 지킬 것)
- Vite + React (.jsx), JavaScript (TypeScript 아님)
- Tailwind CSS + shadcn/ui 사용
- Supabase (Auth + Database) 사용, 백엔드는 Supabase RLS로 처리
- 경로 별칭(@/)은 jsconfig.json + vite.config.js 기준으로 설정

## 범위 규칙
- 회원가입(signUp) + 로그인(signInWithPassword) 모두 구현 — shadcn Tabs로 전환
- 소셜 로그인, 비밀번호 찾기 등은 만들지 않음 (범위 밖)
- 결제 기능 없음 (주문 접수까지만)

## 브랜드 규칙
- (디저트 가게 컨셉에 맞는 톤/색상 — 필요시 채워넣기)

## 코드 스타일
- 컴포넌트 단위로 pages/ 폴더에 분리
- 데이터(메뉴 등)는 data/ 폴더로 분리

## 대화 규칙
- 비밀번호 직접 저장/비교 코드 금지 (Supabase Auth 메서드만 사용)
- service_role key 우회 금지