create table user_statistics
(
    id            serial  not null,
    wins_count    integer not null,
    defeats_count integer not null,
    user_id       integer not null,

    constraint "PK_user_statistics_id" primary key (id),

    constraint "REL_user_statistics" unique (user_id),

    constraint "FK_user_statistics"
        foreign key (user_id) references users (id)
            on delete cascade on update cascade
);
