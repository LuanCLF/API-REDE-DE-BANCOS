/*
  Warnings:

  - You are about to drop the column `value` on the `deposits` table. All the data in the column will be lost.
  - Added the required column `float` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deposits" DROP COLUMN "value",
ADD COLUMN     "float" DOUBLE PRECISION NOT NULL;
