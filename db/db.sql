DROP DATABASE IF EXISTS "limelinkapp";

CREATE DATABASE "limelinkapp";

\c "limelinkapp"

CREATE TABLE "users" (
    "id" SERIAL,
    "fullName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "bio" TEXT DEFAULT 'I love LimeLink!',
    "avatar" VARCHAR(511),
    "interests" VARCHAR(255) [],
    "birthDate" DATE,
    "isPrivate" BOOLEAN NOT NULL DEFAULT FALSE,
    "isOnline" BOOLEAN NOT NULL DEFAULT FALSE,
    "postIds" INTEGER [],

    CONSTRAINT "users_id_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "posts" (
    "id" SERIAL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfLikes" INTEGER DEFAULT 0,
    "commentIds" INTEGER [],

    CONSTRAINT "posts_id_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "posts_url_unique" UNIQUE("url")
);

CREATE TABLE "comments" (
    "id" SERIAL,
    "comment" VARCHAR(511) NOT NULL, 
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "numberOfLikes" INTEGER DEFAULT 0,

    CONSTRAINT "comments_id_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "follows" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "follows_followerId_followingId_pkey" PRIMARY KEY ("followerId", "followingId")
);

CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "posts_id_key" ON "posts"("id");

CREATE UNIQUE INDEX "comments_id_key" ON "comments"("id");

ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE CASCADE;
