/*
  Warnings:

  - You are about to drop the `EmployeesTerritory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EmployeesTerritory` DROP FOREIGN KEY `EmployeesTerritory_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `EmployeesTerritory` DROP FOREIGN KEY `EmployeesTerritory_territoryId_fkey`;

-- DropTable
DROP TABLE `EmployeesTerritory`;

-- CreateTable
CREATE TABLE `EmployeeTerritory` (
    `employeeId` INTEGER NOT NULL,
    `territoryId` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`employeeId`, `territoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeTerritory` ADD CONSTRAINT `EmployeeTerritory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeTerritory` ADD CONSTRAINT `EmployeeTerritory_territoryId_fkey` FOREIGN KEY (`territoryId`) REFERENCES `Territory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
