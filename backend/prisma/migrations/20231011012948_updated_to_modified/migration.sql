/*
  Warnings:

  - You are about to drop the column `updated_date` on the `lists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lists" DROP COLUMN "updated_date",
ADD COLUMN     "modified_date" TIMESTAMP(6);
