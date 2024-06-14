CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY NOT NULL,
	`subscription` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
