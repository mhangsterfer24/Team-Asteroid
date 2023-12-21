# EV Charging Stations Map

## How the project came to be
This code is the completion of the Special Interest Project for UWM Cloud Computing
for Team Asteroid. The project has two main sections, a basic data pipeline that takes
data from an API, puts it into S3, takes it out of S3, cleans it, and places it in
a RDS. Secondly, a React web application which calls the database in order to populate
an interface build on top of Google Maps API to populate where the EV charging stations
are located within the zip code specified by the user.

## How to use the project
A user could adjust the code to run on their local machine quite easily by making use
of an .env file. However, since this is for a Cloud Computing course, we will focus on
how to use the code to operate on AWS. You must have an AWS account and be able to create
an RDS (we used MySQL), Lambda functions, and an EC2 instance. We triggered our functions
with EventBridge and StepFunctions but have not included that here. We have included the
zip files that can be used as layers for the Lambda functions. You must also use 
AWSSDKPandas-Python310 which is provided by AWS. You can then implement two lambda
functions with the needed layers to get the API Pull, S3, and RDS working. You can
then use the client and backend folders to implement the React web application on the
EC2 instance. Note the EC2 instance and MySQL database must be in the same VPC in order
for the web application to work correctly. For more information please read our blog
which can be found via the UWM Cloud Computing website.

## Credits
Vaishnavi Manikonda,
Nathan Leverence,
Michael Hangsterfer,
Anthony Alagna
