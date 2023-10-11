-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_date" TIMESTAMP(6);
