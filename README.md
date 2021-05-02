# Table Of Contents
1. [Overview](#Overview)
1. [Technologies](#Technologies)
1. [SQL vs NoSQL](#SQLnoSQL)
1. [ETL Process](#ETL)

# Overview
Project Roadrunner is a back-end ratings and reviews microservice optimization for a product catalog web application. This repo contains the ETL process for the sample data, the database queries, local K6 testing files, and a docker file to easily deploy servers across AWS instances.

This project was horizontally scaled across 4 AWS EC2 instances for maximum throughput and utilized NGINX for caching and least-time load balancing.

After technologies sections, the rest of the README will be an outline of the decisions I made during the project, why I made them, and the outcomes of those decisions.

# Technologies
1. MongoDB
2. NGINX
3. Express
4. Docker + Docker Hub
5. AWS (EC2)

# SQL vs NoSQL
Before creating an ETL process for the database, I needed choose which type of database (SQL vs NoSQL) would be optimal for the front-end Ratings & Reviews microservice. I made mock schemas for each database, and weighed the pros and cons of each. Ultimately, I decided on a NoSQL database, (MongoDB) for these main reasons:

1. The non-uniform nature of the data that the client was expecting.
2. The document-style / structure of the data the client was expecting.
3. MongoDB's ability to nest data, which would reduce join's & server-side "per request" operations.

![](https://i.ibb.co/PYwLxN8/SDC-DB.png)