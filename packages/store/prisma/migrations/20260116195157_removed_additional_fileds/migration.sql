/*
  Warnings:

  - You are about to drop the `region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `website` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `website_tick` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "website" DROP CONSTRAINT "website_user_id_fkey";

-- DropForeignKey
ALTER TABLE "website_tick" DROP CONSTRAINT "website_tick_region_id_fkey";

-- DropForeignKey
ALTER TABLE "website_tick" DROP CONSTRAINT "website_tick_website_id_fkey";

-- DropTable
DROP TABLE "region";

-- DropTable
DROP TABLE "website";

-- DropTable
DROP TABLE "website_tick";

-- DropEnum
DROP TYPE "website_status";
