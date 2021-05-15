create table games
(
    id         serial  not null,
    lobby_id   integer not null,
    state_json text,

    constraint "PK_game_id" primary key (id),

    constraint "FK_lobby_game"
        foreign key (lobby_id) references lobbies (id)
            on delete cascade on update cascade
);
