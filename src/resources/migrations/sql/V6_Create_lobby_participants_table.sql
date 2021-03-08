create table lobby_participants
(
    user_id    integer not null,
    lobby_id   integer not null,
    is_creator boolean not null default false,
    is_ready   boolean not null default false,

    constraint "PK_lobby_participant" primary key (user_id, lobby_id),

    constraint "REL_user_lobby_participant" unique (user_id),

    constraint "FK_user_lobby_participant"
        foreign key (user_id) references users (id)
            on delete cascade on update cascade,

    constraint "FK_lobby_lobby_participant"
        foreign key (lobby_id) references lobbies (id)
            on delete cascade on update cascade
);
