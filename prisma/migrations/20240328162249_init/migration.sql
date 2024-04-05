-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MetricComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metricId" INTEGER NOT NULL,
    "factor" REAL NOT NULL,
    "goalId" INTEGER NOT NULL,
    CONSTRAINT "MetricComponent_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MetricComponent_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MetricComponent" ("factor", "goalId", "id", "metricId") SELECT "factor", "goalId", "id", "metricId" FROM "MetricComponent";
DROP TABLE "MetricComponent";
ALTER TABLE "new_MetricComponent" RENAME TO "MetricComponent";
CREATE TABLE "new_Goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "steps" INTEGER NOT NULL,
    "completed" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Goal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("completed", "id", "name", "ownerId", "steps") SELECT "completed", "id", "name", "ownerId", "steps" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE TABLE "new_Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Metric_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Metric" ("id", "name", "ownerId") SELECT "id", "name", "ownerId" FROM "Metric";
DROP TABLE "Metric";
ALTER TABLE "new_Metric" RENAME TO "Metric";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
