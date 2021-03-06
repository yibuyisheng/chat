-- 数据库构建

CREATE SCHEMA `chat` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;

CREATE TABLE `chat`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `nickname` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `avatar` VARCHAR(200) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `chat`.`chatroom` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `type` TINYINT NULL,                           # type=1：只有两人的好友关系房间；type=2：群
  PRIMARY KEY (`id`));

CREATE TABLE `chat`.`message` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(10000) NULL,
  `from_user_id` INT(11) NULL,
  `chatroom_id` INT(11) NULL,
  `send_date` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `chat`.`chatroom_user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `chatroom_id` INT(11) NULL,
  `user_id` INT(11) NULL,
  PRIMARY KEY (`id`));

