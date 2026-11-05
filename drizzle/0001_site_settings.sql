-- Apariencia configurable de la tienda (una sola fila).
-- Aditivo: no modifica ninguna tabla existente. Se puede correr más de una vez.
create table if not exists public.site_settings (
  id          smallint primary key default 1,
  theme       varchar(20) not null default 'calido',
  accent      varchar(7),
  bg          varchar(7),
  text_color  varchar(7),
  font_pair   varchar(20) not null default 'elegante',
  radius      varchar(10) not null default 'recto',
  admin_theme varchar(10) not null default 'light',
  updated_at  timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1),
  constraint site_settings_theme_chk  check (theme in ('calido','noche','minimal','rosa','salvia')),
  constraint site_settings_font_chk   check (font_pair in ('elegante','moderno','clasico')),
  constraint site_settings_radius_chk check (radius in ('recto','suave','redondeado')),
  constraint site_settings_admin_chk  check (admin_theme in ('light','dark','system')),
  constraint site_settings_hex_chk check (
    (accent is null or accent ~ '^#[0-9a-f]{6}$') and
    (bg is null or bg ~ '^#[0-9a-f]{6}$') and
    (text_color is null or text_color ~ '^#[0-9a-f]{6}$')
  )
);

-- RLS sin políticas: la API pública de Supabase (anon key) no puede leer ni escribir.
-- La app accede por la conexión directa del servidor.
alter table public.site_settings enable row level security;

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
