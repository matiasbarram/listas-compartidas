/*
  Warnings:

  - Made the column `list_id` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "list_id" SET NOT NULL;
