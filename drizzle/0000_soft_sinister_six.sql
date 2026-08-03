CREATE TABLE `menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`calories` integer NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`image` text DEFAULT 'lamb' NOT NULL
);
