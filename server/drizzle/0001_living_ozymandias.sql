DROP TABLE `subscriptions`;--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY NOT NULL,
	`endpoint` text NOT NULL,
	`expiration_time` integer,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`modified_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_endpoint_unique` ON `subscriptions` (`endpoint`);