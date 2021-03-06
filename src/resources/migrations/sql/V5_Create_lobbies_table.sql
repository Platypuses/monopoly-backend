create type lobby_status_enum as enum ('WAITING_FOR_PLAYERS', 'IN_GAME');

create table lobbies
(
    id     serial            not null,
    status lobby_status_enum not null,

    constraint "PK_lobby_id" primary key (id)
);
