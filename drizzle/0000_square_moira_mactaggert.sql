CREATE TABLE `articles` (
	`title` text PRIMARY KEY NOT NULL,
	`content` text,
	`created_at` integer DEFAULT (unixepoch())
);
