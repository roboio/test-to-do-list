#!/bin/bash

# Prompt the user for AWS region
#read -p "Enter your AWS region (e.g., us-west-2): " AWS_REGION
AWS_REGION=us-east-1

STACK_NAME=todo-app-stack
TEMPLATE_FILE=template.yaml
SCHEMA_FILE=schema.graphql

# Generate a valid S3 bucket name
UUID=$(uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '-')
TEMP_BUCKET="temp-schema-bucket-$UUID"

# Create a temporary S3 bucket for the schema file
aws s3 mb s3://$TEMP_BUCKET --region $AWS_REGION

# Check if bucket creation was successful
if [ $? -ne 0 ]; then
    echo "Failed to create S3 bucket. Exiting."
    exit 1
fi

# Upload the schema file to the temporary S3 bucket
aws s3 cp $SCHEMA_FILE s3://$TEMP_BUCKET/$SCHEMA_FILE --region $AWS_REGION

# Deploy CloudFormation Stack with the S3 bucket parameter
aws cloudformation deploy \
  --template-file $TEMPLATE_FILE \
  --stack-name $STACK_NAME \
  --parameter-overrides SchemaBucketName=$TEMP_BUCKET \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $AWS_REGION

# Check if CloudFormation deployment was successful
if [ $? -ne 0 ]; then
    echo "Failed to deploy CloudFormation stack. Exiting."
    exit 1
fi

# Get S3 bucket name from stack outputs
S3_BUCKET=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text --region $AWS_REGION)

# Build Vue.js project
npm run build

# Sync built files to S3 bucket
aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION

# Output the website URL
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text --region $AWS_REGION)
echo "Website is available at: $WEBSITE_URL"

# Cleanup the temporary S3 bucket
aws s3 rb s3://$TEMP_BUCKET --force --region $AWS_REGION
