/*
  Warnings:

  - A unique constraint covering the columns `[userId,actorId,type,targetType,targetId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationTargetType" AS ENUM ('POST', 'EVENT', 'COMMENT', 'USER');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "targetId" TEXT,
ADD COLUMN     "targetType" "NotificationTargetType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_actorId_type_targetType_targetId_key" ON "Notification"("userId", "actorId", "type", "targetType", "targetId");
