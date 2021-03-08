create table users
(
    id                serial       not null,
    nickname          varchar(50)  not null,
    password          varchar(100) not null,
    registration_date timestamp    not null,

    constraint "PK_user_id" primary key (id)
);
