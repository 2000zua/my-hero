-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NULL,
    `language` ENUM('es', 'en', 'ru') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hero` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `realName` VARCHAR(191) NOT NULL,
    `alterEgo` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `public` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VotesOnHeroes` (
    `userId` VARCHAR(191) NOT NULL DEFAULT '',
    `heroId` VARCHAR(191) NOT NULL DEFAULT '',
    `assignedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `heroId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hero` ADD CONSTRAINT `Hero_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VotesOnHeroes` ADD CONSTRAINT `VotesOnHeroes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VotesOnHeroes` ADD CONSTRAINT `VotesOnHeroes_heroId_fkey` FOREIGN KEY (`heroId`) REFERENCES `Hero`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
