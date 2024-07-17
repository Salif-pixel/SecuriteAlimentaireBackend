-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `isResettingPassword` BOOLEAN NOT NULL DEFAULT 0,
    `resetPasswordToken` VARCHAR(191) UNIQUE NULL,
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
