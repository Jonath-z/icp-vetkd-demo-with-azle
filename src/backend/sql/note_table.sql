CREATE TABLE IF NOT EXISTS notes (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT
    "note" TEXT NOT NULL
    "principal" varchar(255) NOT NULL UNIQUE
    FOREIGN KEY ("principal") REFERENCES "users" ("principal") ON DELETE CASCADE
)