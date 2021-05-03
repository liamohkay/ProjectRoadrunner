# Table Of Contents
1. [Overview](#Overview)
1. [Technologies](#Technologies)
1. [SQL vs NoSQL](#SQL-vs-NoSQL)
1. [ETL Process](#ETL-Process)
1. [Horizontal Scaling with AWS + NGINX](#Horizontal-Scaling-with-AWS-+-NGINX)

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
Before creating an ETL process for the database, I needed choose which type of database (SQL vs NoSQL) would be optimal for the front-end Ratings & Reviews microservice. I made mock schemas for each database, and weighed the pros and cons of each. Ultimately, I decided on a NoSQL database, (MongoDB) for these three main reasons:

1. The non-uniform nature of the expected response data.
2. The document-style / structure of the expected response data.
3. MongoDB's ability to nest data, which would reduce joins & server-side "per request" operations and improve performance.

![](https://i.ibb.co/PYwLxN8/SDC-DB.png)

Ultimately, choosing MongoDB combined with my [ETL Process](#ETL-Process) resulted in very performant queries. Below are two K6 outputs from the main Ratings & Review "GET" endpoint. These tests were run randomly selecting IDs across the entire range of over 6 million IDs.

### Load Test | 100 VUs | 4min 30s
- 13 ms mean request duration
- 100% accuracy

![](https://i.ibb.co/L8GdtNV/get-Reviews.png)


### Stress Test | 1000 VUs | 30s
- 683 ms mean request duration
- 100% accuracy

![](https://i.ibb.co/K6v6JCc/stress-Get-Reviews.png)

# ETL Process
The given data to load was seperated out into 4 .csv files totaling ~35 million records. Given that the front-end microservice had already been built using sample data, my main goals were:

1. Transform .csv data and store in MongoDB such that the database schema mirrored the client's expected response from certain API requests. This would negate a single API call prompting multiple queries to different collections and reduce request time.
2. Create an efficient ETL process to load the large amount of data, as I knew ultimately the entire process would be run on an AWS EC2 instance with limited computing capabilities.

## Extract & Transform
Planning the database schema was rather trivial after whiteboarding.

![](https://i.ibb.co/brqj5s3/SDC-DB.png)

I examined the existing front-end endpoints and the response data alongside the 4 .csvs I would be seeding. The two main existing endpoints were `/reviews` and `/reviews/meta`. Based on those endpoints I decided to create two primary collections, "Reviews" and "Characteristics", and 2 sub-schemas for "Photos" and "Characteristic_Reviews" that I would embed in "Reviews" and "Characteristics" respectively.

- The "Reviews" collection contained information from the corresponding .csv as well as nested data from "photos.csv".
- The "Characteristics" collection contained information from the corresponding .csv as well as nested data from "characteristic_reviews.csv".

Each collection's data & schema matched the existing front-end response data format, which removed any server-side join's or transofmrations and reduced server-side calculations which reduce "GET" request response times to these endpoints.

## Load
Creating an efficient load process for 35 million records was a challenge. Ultimately, there were two strategies that I ultilzed which exponentially reduced the seed time.

1. Readstreams
2. Unordered Bulk Insert/Upsert

The utilization of csv readstreams & unordered bulk inserts/upserts resulted in the seed time of 35 million records on an AWS EC2 instance to be a litle over an hour.

# Horizontal Scaling with AWS + NGINX
After deploying my database and 1 server EC2 instance, I ran an intial loader.io stress test and quickly realized I would need to horizontally scale to handle higher throughput.

Using Docker images of my server, I incrementally added EC2 instances of my server to handle traffic. In addition, I implemented NGINX least-time load balancing to equally distribute requests across my instances. Each instance added on average ~100 requests per second to the overall throughput with a 0% error rate. However at 4 servers, the average throughput for every endpoint was only 1200 RPS with 0% error.

I did not want to keep deploying instances for a marginal return, and that's when I implmented caching with NGINX. Caching was the game changer. It improved the amount of throughput the microservice could handle 9-fold, from 1200 RPS to 10,000 RPS.

### Stress Test | `/reviews/meta` | 10,000 RPS | 30s
- 64 ms mean request duration
- 100% accuracy

![](https://i.ibb.co/7vFNkNV/Screen-Shot-2021-05-02-at-7-07-53-PM.png)
