create table users
(
    id                serial       not null,
    nickname          varchar(50)  not null,
    password          varchar(100) not null,
    registration_date timestamp    not null,

    constraint "PK_user_id" primary key (id)
);

create table user_statistics
(
    id            serial  not null,
    wins_count    integer not null,
    defeats_count integer not null,
    user_id       integer not null,

    constraint "PK_user_statistics_id" primary key (id),
    constraint "REL_user_statistics" unique (user_id),
    constraint "FK_user_statistics"
        foreign key (user_id)
            references users (id)
            on delete cascade on update cascade
);

create type media_type_enum as enum ('PNG', 'JPG');

create table avatars
(
    id         serial          not null,
    file_path  text            not null,
    media_type media_type_enum not null,
    user_id    integer         not null,

    constraint "PK_avatar_id" primary key (id),
    constraint "REL_user_avatar" unique (user_id),

    constraint "FK_user_avatar"
        foreign key (user_id)
            references users (id)
            on delete cascade on update cascade
);

create table refresh_tokens
(
    id      serial      not null,
    value   varchar(50) not null,
    user_id integer     not null,

    constraint "PK_refresh_token_id" primary key (id),

    constraint "FK_user_refresh_token"
        foreign key (user_id)
            references users (id)
            on delete cascade on update cascade
);

create type lobby_status_enum as enum ('WAITING_FOR_PLAYERS', 'IN_GAME');

create table lobbies
(
    id           serial            not null,
    uuid         varchar(50)       not null,
    lobby_status lobby_status_enum not null,

    constraint "PK_lobby_id" primary key (id)
);

create table lobby_participants
(
    user_id    integer not null,
    lobby_id   integer not null,
    is_creator boolean not null default false,
    is_ready   boolean not null default false,

    constraint "PK_lobby_participant" primary key (user_id, lobby_id),
    constraint "REL_user_lobby_participant" unique (user_id),

    constraint "FK_user_lobby_participant"
        foreign key (user_id)
            references users (id)
            on delete cascade on update cascade,

    constraint "FK_lobby_lobby_participant"
        foreign key (lobby_id)
            references lobbies (id)
            on delete cascade on update cascade
);

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
