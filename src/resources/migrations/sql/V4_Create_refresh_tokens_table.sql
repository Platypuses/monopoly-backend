create table refresh_tokens
(
    id      serial      not null,
    value   varchar(50) not null,
    user_id integer     not null,

    constraint "PK_refresh_token_id" primary key (id),

    constraint "FK_user_refresh_token"
        foreign key (user_id) references users (id)
            on delete cascade on update cascade
);
