/*
  Warnings:

  - You are about to drop the column `user_id` on the `groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_user_id_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "user_id";
