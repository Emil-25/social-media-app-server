CREATE DATABASE "limelinkapp";

CREATE TABLE "users" (
    "id" SERIAL,
    "fullname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "bio" TEXT DEFAULT "I love LimeLink!",
    "interests" VARCHAR(255) [],
    "birthDate" DATE,
    "isOnline" BOOLEAN NOT NULL,
    "posts" INTEGER [],

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
    "comments" INTEGER [],

    CONSTRAINT "posts_id_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "posts_url_unique" UNIQUE("url")
);

CREATE TABLE "comments" (
    "id" SERIAL,
    "comment" VARCHAR(511) NOT NULL, 
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "numberOfLikes" INTEGER DEFAULT 0,

    CONSTRAINT "comments_id_pkey" PRIMARY KEY ("id"),
)
