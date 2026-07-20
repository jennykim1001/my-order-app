-- profiles: 사장(owner) 여부를 판별하는 근거 테이블 (PRD [회원·권한 설계])
-- role 기본값은 'customer'이며, 사장 계정만 Supabase에서 수동으로 'owner'로 변경한다.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer'
);

alter table profiles enable row level security;

-- 본인 profiles 행만 조회 가능 — orders RLS가 role을 확인할 때 이 정책을 통과해야 한다.
create policy "profiles_select_own" on profiles
  for select
  using (id = auth.uid());

-- 회원가입 시 profiles 행을 자동 생성한다 (role은 기본값 'customer').
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- orders: 주문 내역 테이블
create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  pickup_time text not null,
  items text not null,
  total_price bigint not null,
  status text not null default '접수',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- 손님은 자기 주문만, 사장(owner)은 전체 주문을 조회할 수 있다.
create policy "orders_select_own_or_owner" on orders
  for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from profiles where id = auth.uid() and role = 'owner'
    )
  );

-- 손님은 자기 명의로만 주문을 생성할 수 있다 (다른 사람 user_id로 주문 대납 방지).
create policy "orders_insert_own" on orders
  for insert
  with check (user_id = auth.uid());

-- 주문 상태 변경(완료 처리)은 사장만 가능하다.
create policy "orders_update_owner_only" on orders
  for update
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'owner'
    )
  );

-- 주문 삭제도 사장만 가능하다.
create policy "orders_delete_owner_only" on orders
  for delete
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'owner'
    )
  );
