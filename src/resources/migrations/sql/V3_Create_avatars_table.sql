create type avatar_media_type_enum as enum ('PNG', 'JPG');

create table avatars
(
    id         serial                 not null,
    file_path  text                   not null,
    media_type avatar_media_type_enum not null,
    user_id    integer                not null,

    constraint "PK_avatar_id" primary key (id),

    constraint "REL_user_avatar" unique (user_id),

    constraint "FK_user_avatar"
        foreign key (user_id) references users (id)
            on delete cascade on update cascade
);
