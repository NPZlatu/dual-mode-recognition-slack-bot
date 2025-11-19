-- CreateTable
CREATE TABLE `MessageQueue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `channelId` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `eventType` VARCHAR(191) NULL,
    `message` VARCHAR(191) NOT NULL,
    `delivered` BOOLEAN NOT NULL DEFAULT false,
    `retryCount` INTEGER NOT NULL DEFAULT 0,
    `batchDate` DATETIME(3) NULL,
    `createdDateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deliveredDateTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
