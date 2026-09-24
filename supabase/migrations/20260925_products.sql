-- 상품·금액 관리 테이블 (관리자 페이지 /admin/products 에서 수정)
-- Supabase 대시보드 > SQL Editor 에서 한 번 실행

create table if not exists public.product_groups (
  key text primary key check (key in ('location', 'design', 'banner_3d')),
  title text not null,
  subtitle text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  key text primary key,
  category text not null references public.product_groups(key),
  label text not null,
  price integer not null check (price >= 0),
  unit text not null default '',
  description text not null default '',
  badge text not null default '',
  note text not null default '',
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- 서버(service role)만 접근. 외부(anon) 직접 조회 차단
alter table public.product_groups enable row level security;
alter table public.products enable row level security;

-- 현재 사이트 금액으로 초기 데이터 (이미 있으면 건너뜀)
insert into public.product_groups (key, title, subtitle, sort_order) values
  ('location', '위치 사용권', '', 0),
  ('design', '기본 배너', '', 1),
  ('banner_3d', '3D 모션 배너', '제작 기준: 초당 ₩110,000 (부가세 별도)', 2)
on conflict (key) do nothing;

insert into public.products (key, category, label, price, unit, description, badge, note, features, sort_order, active) values
  ('location', 'location', '일반 GPS 위치 사용권', 100000, '년', '원하는 GPS 좌표에 연간 독점 AR 노출권을 확보합니다.', '연간', '', '["좌표 독점 운영권","GPS 오차 ±2m"]'::jsonb, 0, true),
  ('location_daily', 'location', '대중집합공간 위치 사용권', 100000, '일', 'CONTEX가 보유한 대중집합공간에 AR 광고를 집행합니다. 원하는 일수만큼 유연하게 운영하세요.', '일 단위', '', '["유동 인구 밀집 공간","일 단위 자유로운 기간 설정","콘텐츠 별도 선택 가능"]'::jsonb, 1, true),
  ('design_create', 'design', '배너 디자인 제작', 150000, '회', '브랜드 가이드에 맞는 AR 배너를 기획·디자인·최적화까지 맞춤 제작합니다. 파일 교체 비용 포함.', '', '', '[]'::jsonb, 0, true),
  ('design_change', 'design', '배너 파일 교체', 20000, '회', '완성된 배너 파일을 직접 전달 시 서버 등록 및 교체. 별도 디자인 작업 없이 빠르게 업데이트.', '', '', '[]'::jsonb, 1, true),
  ('banner_3d_replace', 'banner_3d', '3D 모션 배너 파일 교체', 60000, '회', '완성된 3D 소재 파일을 전달하면 서버에 등록 후 기존 배너와 교체합니다.', '', '', '[]'::jsonb, 0, true),
  ('banner_3d_5s', 'banner_3d', '3D 모션 배너 제작 (5초)', 550000, '', '자연스러운 모션과 루프가 가능한 기본 길이입니다.', '기본', '', '[]'::jsonb, 1, true),
  ('banner_3d_10s', 'banner_3d', '3D 모션 배너 제작 (10초)', 1067000, '', '풍부한 연출과 스토리텔링이 가능한 가장 많이 선택하는 길이입니다.', 'Best', '3% 할인 적용', '[]'::jsonb, 2, true),
  ('banner_3d_15s', 'banner_3d', '3D 모션 배너 제작 (15초)', 1567500, '', '긴 스토리와 다양한 씬 전환이 가능한 프리미엄 모션 배너입니다.', '', '5% 할인 적용', '[]'::jsonb, 3, true)
on conflict (key) do nothing;
