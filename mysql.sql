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

CREATE TABLE `chat`.`friend` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id_driving` INT(11) NULL,                 # 主动发起添加好友的
  `user_id_passive` INT(11) NULL,                 # 被动接受好友请求的
  PRIMARY KEY (`id`));

