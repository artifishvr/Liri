CREATE TABLE IF NOT EXISTS `Members` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`userid` text(255) NOT NULL,
	`kissys` integer DEFAULT 0 NOT NULL,
	`hugged` integer DEFAULT 0 NOT NULL,
	`dominated` integer DEFAULT 0 NOT NULL,
	`deaths` integer DEFAULT 0 NOT NULL,
	`createdAt` numeric NOT NULL,
	`updatedAt` numeric NOT NULL
);