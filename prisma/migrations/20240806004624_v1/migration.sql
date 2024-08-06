/*
  Warnings:

  - You are about to drop the column `data` on the `registro_caravana` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `partida` to the `registro_caravana` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "registro_caravana" DROP COLUMN "data",
ADD COLUMN     "partida" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "retorno" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tipos_onibus" ALTER COLUMN "foto" DROP NOT NULL;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "role",
ADD COLUMN     "permissao" TEXT,
ALTER COLUMN "criado" SET DEFAULT CURRENT_TIMESTAMP;
