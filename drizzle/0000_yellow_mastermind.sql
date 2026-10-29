CREATE TABLE `member_counter` (
	`id` integer PRIMARY KEY NOT NULL,
	`value` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `member_requests` (
	`request_key` text PRIMARY KEY NOT NULL,
	`member_number` integer,
	`nickname` text NOT NULL,
	`title` text NOT NULL,
	`joined` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_requests_member_number_unique` ON `member_requests` (`member_number`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`fingerprint` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `member_counter` (`id`, `value`) VALUES (1, 0);
--> statement-breakpoint
CREATE TRIGGER `allocate_member_number`
AFTER INSERT ON `member_requests`
FOR EACH ROW WHEN NEW.`member_number` IS NULL
BEGIN
	UPDATE `member_counter` SET `value` = `value` + 1 WHERE `id` = 1;
	UPDATE `member_requests`
	SET `member_number` = (SELECT `value` FROM `member_counter` WHERE `id` = 1)
	WHERE `request_key` = NEW.`request_key`;
END;
