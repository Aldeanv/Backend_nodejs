/*
  Warnings:

  - A unique constraint covering the columns `[NIK]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_NIK_key" ON "User"("NIK");
