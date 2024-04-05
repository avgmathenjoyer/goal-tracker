-- CreateTable
CREATE TABLE "Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MetricComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metricId" INTEGER NOT NULL,
    "factor" REAL NOT NULL,
    "goalId" INTEGER NOT NULL,
    CONSTRAINT "MetricComponent_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MetricComponent_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
