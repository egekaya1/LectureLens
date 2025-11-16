create table lectures (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    transcript text,
    created_at timestamp default now()
);