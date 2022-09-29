-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Territory` (
    `id` VARCHAR(20) NOT NULL,
    `description` VARCHAR(50) NOT NULL,
    `regionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(20) NOT NULL,
    `firstName` VARCHAR(10) NOT NULL,
    `title` VARCHAR(30) NULL,
    `titleOfCortesy` VARCHAR(25) NULL,
    `birthDate` DATETIME(3) NULL,
    `hireDate` DATETIME(3) NULL,
    `address` VARCHAR(60) NULL,
    `city` VARCHAR(15) NULL,
    `region` VARCHAR(15) NULL,
    `postalCode` VARCHAR(10) NULL,
    `country` VARCHAR(15) NULL,
    `homePhone` VARCHAR(24) NULL,
    `extension` VARCHAR(4) NULL,
    `photo` BLOB NULL,
    `notes` TEXT NULL,
    `reportsTo` INTEGER NULL,
    `photoPath` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeesTerritory` (
    `employeeId` INTEGER NOT NULL,
    `territoryId` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`employeeId`, `territoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(40) NOT NULL,
    `contactName` VARCHAR(30) NULL,
    `contactTitle` VARCHAR(30) NULL,
    `address` VARCHAR(60) NULL,
    `city` VARCHAR(15) NULL,
    `region` VARCHAR(15) NULL,
    `postalCode` VARCHAR(10) NULL,
    `country` VARCHAR(15) NULL,
    `phone` VARCHAR(24) NULL,
    `fax` VARCHAR(24) NULL,
    `homePage` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productName` VARCHAR(40) NOT NULL,
    `supplierId` INTEGER NULL,
    `categoryId` INTEGER NULL,
    `quantityPerUnit` VARCHAR(20) NULL,
    `unitPrice` DOUBLE NULL,
    `unitsInStock` INTEGER NULL,
    `unitsOnOrder` INTEGER NULL,
    `reorderLevel` INTEGER NULL,
    `discontinued` TINYINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(15) NOT NULL,
    `description` TEXT NULL,
    `picture` BLOB NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(5) NOT NULL,
    `companyName` VARCHAR(40) NOT NULL,
    `contactName` VARCHAR(30) NULL,
    `contactTitle` VARCHAR(30) NULL,
    `address` VARCHAR(60) NULL,
    `city` VARCHAR(15) NULL,
    `region` VARCHAR(15) NULL,
    `postalCode` VARCHAR(10) NULL,
    `country` VARCHAR(15) NULL,
    `phone` VARCHAR(24) NULL,
    `fax` VARCHAR(24) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` VARCHAR(5) NULL,
    `employeeId` INTEGER NULL,
    `orderDate` DATETIME(3) NULL,
    `requiredDate` DATETIME(3) NULL,
    `shippedDate` DATETIME(3) NULL,
    `shipVia` INTEGER NULL,
    `freight` DOUBLE NULL,
    `shipName` VARCHAR(40) NULL,
    `shipAddress` VARCHAR(60) NULL,
    `shipCity` VARCHAR(15) NULL,
    `shipRegion` VARCHAR(15) NULL,
    `shipPostalCode` VARCHAR(10) NULL,
    `shipCountry` VARCHAR(15) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetail` (
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `discount` DOUBLE NOT NULL,

    PRIMARY KEY (`orderId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(40) NOT NULL,
    `phone` VARCHAR(24) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Territory` ADD CONSTRAINT `Territory_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeesTerritory` ADD CONSTRAINT `EmployeesTerritory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeesTerritory` ADD CONSTRAINT `EmployeesTerritory_territoryId_fkey` FOREIGN KEY (`territoryId`) REFERENCES `Territory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shipVia_fkey` FOREIGN KEY (`shipVia`) REFERENCES `Shipper`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
