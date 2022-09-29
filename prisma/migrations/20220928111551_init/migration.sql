-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_reportsTo_fkey` FOREIGN KEY (`reportsTo`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
