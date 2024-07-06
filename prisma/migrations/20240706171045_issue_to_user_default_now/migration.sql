-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IssueToUser" (
    "issueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("issueId", "userId"),
    CONSTRAINT "IssueToUser_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "IssueToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_IssueToUser" ("assignedAt", "issueId", "userId") SELECT "assignedAt", "issueId", "userId" FROM "IssueToUser";
DROP TABLE "IssueToUser";
ALTER TABLE "new_IssueToUser" RENAME TO "IssueToUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
