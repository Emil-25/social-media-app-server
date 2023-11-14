
## [Lime Link Website](https://www.lime-link.xyz)

# Project Title
Lime Link

# Project Description
This is the backend of **Lime Link** web application. You can share your pictures and videos as well as follow people to see their content and comment about them. 
The app is similar to social media apps such as Instagram, LinkedIn.

## Technical Part

The application was build in Node js using **Express.js** framework. For media storage application subfolder is utilized. Authentication problem is solved with the help of JSON Web Token (JWT). All CRUD operations are done via Prisma ORM.
App is deployed via Docker on AWS EC2.

# Getting Started

## Installation

	git clone https://github.com/Emil-25/social-media-app-server.git
	cd social-media-app-server
	npm install

## Usage 

You can call endpoints for the necessary data

> Note: Some endpoints may require authentication.

## Features

User can fetch data for:
* Comments
* Posts
* Followers
* Followings
* Likes
* Authentication
