alter table lectures
add column user_id uuid references auth.users(id) not null;