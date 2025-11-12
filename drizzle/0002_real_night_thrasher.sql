CREATE TABLE `boletos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nossoNumero` varchar(100) NOT NULL,
	`apiProvider` varchar(50) NOT NULL,
	`externalId` varchar(255),
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerDocument` varchar(20),
	`value` int NOT NULL,
	`dueDate` timestamp NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`boletoUrl` text,
	`barcode` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boletos_id` PRIMARY KEY(`id`)
);
