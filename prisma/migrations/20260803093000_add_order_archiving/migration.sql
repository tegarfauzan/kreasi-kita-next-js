-- Preserve payment audit history while allowing orders to disappear from active admin views.
ALTER TABLE `Order` ADD COLUMN `archivedAt` DATETIME(3) NULL;

CREATE INDEX `Order_archivedAt_createdAt_idx` ON `Order`(`archivedAt`, `createdAt`);
