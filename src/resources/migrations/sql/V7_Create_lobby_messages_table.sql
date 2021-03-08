create table lobby_messages
(
    user_id      integer   not null,
    lobby_id     integer   not null,
    message_text text      not null,
    message_date timestamp not null,

    constraint "PK_lobby_message" primary key (user_id, lobby_id),

    constraint "FK_user_lobby_message"
        foreign key (user_id) references users (id)
            on delete cascade on update cascade,

    constraint "FK_lobby_lobby_message"
        foreign key (lobby_id) references lobbies (id)
            on delete cascade on update cascade
);
