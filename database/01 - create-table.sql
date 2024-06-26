drop table dizimo_pagamento;
drop table pessoa;
drop table familia;
drop table setor;
drop table usuario;
drop table dizimo;

create table setor
(
    id_setor int auto_increment,
    nome     varchar(30) not null,
    constraint setor_id_setor_uindex
        unique (id_setor),
    constraint setor_nome_uindex
        unique (nome)
);

alter table setor
    add primary key (id_setor);

create table usuario
(
    id_usuario int auto_increment,
    nome       varchar(30)  not null,
    login      varchar(30)  not null,
    senha      varchar(100) null,
    constraint usuario_id_usuario_uindex
        unique (id_usuario)
);

alter table usuario
    add primary key (id_usuario);

create or replace table familia
(
	id_familia int auto_increment,
	nome varchar(40) not null,
	id_setor int not null,
	endereco varchar(40) null,
	numero varchar(10) null,
	constraint familia_id_familia_uindex
		unique (id_familia),
	constraint familia_nome_uindex
		unique (nome),
	constraint familia_setor_id_setor_fk
		foreign key (id_setor) references setor (id_setor)
);

alter table familia
	add primary key (id_familia);

create table dizimo
(
    mes   varchar(6)                  not null,
    valor decimal(12, 2) default 0.00 null,
    constraint dizimo_mes_uindex
        unique (mes)
);

alter table dizimo
    add primary key (mes);    

create table dizimo_pagamento
(
    mes        varchar(6) not null,
    id_familia int        not null,
    primary key (mes, id_familia),
    constraint dizimo_pagamento_familia_id_familia_fk
        foreign key (id_familia) references familia (id_familia)
);

create table pessoa
(
    id_pessoa  int auto_increment,
    nome       varchar(40) not null,
    id_familia int         not null,
    constraint pessoa_id_pessoa_uindex
        unique (id_pessoa),
    constraint pessoa_familia_id_familia_fk
        foreign key (id_familia) references familia (id_familia)
);

alter table pessoa
    add primary key (id_pessoa);

insert into usuario
(nome, login, senha)
values
('Eduardo Fratoni Motton', 'emotton', md5('senha'));