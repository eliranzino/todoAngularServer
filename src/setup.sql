create database todo;

use todo;

create table users (
ID int not null auto_increment,
userName varchar(20) not null,
password varchar(100) not null,
primary key (ID)
);



create table todo.todos (
ID INT not null auto_increment,
description VARCHAR(200) not null,
date dateTime not null,
Complete TINYINT NOT NULL DEFAULT 0,
UserId INT NULL,
primary key (ID)
);