create type account_type_enum as enum ('PERMANENT_ACCOUNT', 'TEMPORARY_ACCOUNT');

create table users
(
    id                serial            not null,
    nickname          varchar(50)       not null,
    password          varchar(100)      not null,
    registration_date timestamp         not null,
    account_type      account_type_enum not null,

    constraint "PK_user_id" primary key (id)
);
