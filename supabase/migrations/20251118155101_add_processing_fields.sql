alter table lectures
    add column status text default 'pending'
        check(status in ('pending', 'processing', 'completed','failed')),
    add column processing_error text,
    add column processed_at TIMESTAMPTZ,
    add column topic_count int default 0;

create index idx_lectures_status
    on lectures(status)
    where status in ('pending', 'processing');
