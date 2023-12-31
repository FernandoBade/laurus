/*
  Warnings:

  - You are about to drop the column `tipoTransacao` on the `despesa` table. All the data in the column will be lost.
  - You are about to drop the column `tipoTransacao` on the `receita` table. All the data in the column will be lost.
  - Added the required column `contaId` to the `Receita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoTransacaoId` to the `Receita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `despesa` DROP COLUMN `tipoTransacao`,
    ADD COLUMN `contaId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `tipoTransacaoId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `receita` DROP COLUMN `tipoTransacao`,
    ADD COLUMN `contaId` INTEGER NOT NULL,
    ADD COLUMN `tipoTransacaoId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `TipoTransacaoDespesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTransacaoDespesaCartao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTransacaoReceita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTransacaoReceitaCartao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartaoCredito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DespesaCartao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL,
    `dataTransacao` DATETIME(3) NOT NULL,
    `tipoTransacaoId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `subCategoriaId` INTEGER NULL,
    `observacao` VARCHAR(191) NULL,
    `cartaoCreditoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaCartao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL,
    `dataTransacao` DATETIME(3) NOT NULL,
    `tipoTransacaoId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `subCategoriaId` INTEGER NULL,
    `observacao` VARCHAR(191) NULL,
    `cartaoCreditoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DespesaCartaoToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DespesaCartaoToTag_AB_unique`(`A`, `B`),
    INDEX `_DespesaCartaoToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ReceitaCartaoToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ReceitaCartaoToTag_AB_unique`(`A`, `B`),
    INDEX `_ReceitaCartaoToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Despesa` ADD CONSTRAINT `Despesa_contaId_fkey` FOREIGN KEY (`contaId`) REFERENCES `Conta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Despesa` ADD CONSTRAINT `Despesa_tipoTransacaoId_fkey` FOREIGN KEY (`tipoTransacaoId`) REFERENCES `TipoTransacaoDespesa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DespesaCartao` ADD CONSTRAINT `DespesaCartao_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DespesaCartao` ADD CONSTRAINT `DespesaCartao_subCategoriaId_fkey` FOREIGN KEY (`subCategoriaId`) REFERENCES `SubCategoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DespesaCartao` ADD CONSTRAINT `DespesaCartao_cartaoCreditoId_fkey` FOREIGN KEY (`cartaoCreditoId`) REFERENCES `CartaoCredito`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DespesaCartao` ADD CONSTRAINT `DespesaCartao_tipoTransacaoId_fkey` FOREIGN KEY (`tipoTransacaoId`) REFERENCES `TipoTransacaoDespesaCartao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receita` ADD CONSTRAINT `Receita_contaId_fkey` FOREIGN KEY (`contaId`) REFERENCES `Conta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receita` ADD CONSTRAINT `Receita_tipoTransacaoId_fkey` FOREIGN KEY (`tipoTransacaoId`) REFERENCES `TipoTransacaoReceita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaCartao` ADD CONSTRAINT `ReceitaCartao_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaCartao` ADD CONSTRAINT `ReceitaCartao_subCategoriaId_fkey` FOREIGN KEY (`subCategoriaId`) REFERENCES `SubCategoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaCartao` ADD CONSTRAINT `ReceitaCartao_cartaoCreditoId_fkey` FOREIGN KEY (`cartaoCreditoId`) REFERENCES `CartaoCredito`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaCartao` ADD CONSTRAINT `ReceitaCartao_tipoTransacaoId_fkey` FOREIGN KEY (`tipoTransacaoId`) REFERENCES `TipoTransacaoReceitaCartao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DespesaCartaoToTag` ADD CONSTRAINT `_DespesaCartaoToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `DespesaCartao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DespesaCartaoToTag` ADD CONSTRAINT `_DespesaCartaoToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReceitaCartaoToTag` ADD CONSTRAINT `_ReceitaCartaoToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `ReceitaCartao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReceitaCartaoToTag` ADD CONSTRAINT `_ReceitaCartaoToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
