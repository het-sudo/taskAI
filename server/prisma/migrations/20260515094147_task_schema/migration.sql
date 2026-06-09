-- DropIndex
DROP INDEX "Task_category_idx";

-- DropIndex
DROP INDEX "Task_dueDate_idx";

-- DropIndex
DROP INDEX "Task_priority_idx";

-- DropIndex
DROP INDEX "Task_status_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_isActive_idx";

-- CreateTable
CREATE TABLE "TaskShare" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sharedById" TEXT NOT NULL,

    CONSTRAINT "TaskShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskShare_sharedWithId_idx" ON "TaskShare"("sharedWithId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskShare_taskId_sharedWithId_key" ON "TaskShare"("taskId", "sharedWithId");

-- CreateIndex
CREATE INDEX "Task_ownerId_status_idx" ON "Task"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Task_ownerId_priority_idx" ON "Task"("ownerId", "priority");

-- CreateIndex
CREATE INDEX "Task_ownerId_category_idx" ON "Task"("ownerId", "category");

-- AddForeignKey
ALTER TABLE "TaskShare" ADD CONSTRAINT "TaskShare_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskShare" ADD CONSTRAINT "TaskShare_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskShare" ADD CONSTRAINT "TaskShare_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
