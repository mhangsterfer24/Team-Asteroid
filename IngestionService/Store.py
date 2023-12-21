import json
import requests
import boto3
import uuid
from datetime import datetime


class APIData:
    def __init__(self, bucket, ACCESS_KEY, SECRET_KEY):
        self.bucket_name = bucket
        self.s3_client = boto3.client(
            's3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
        self.sns_client = boto3.client('sns', region_name='us-east-2', aws_access_key_id=ACCESS_KEY,
                                       aws_secret_access_key=SECRET_KEY)
        self.data = None
        self.metadata = None

    def load_data(self, data, dataType):
        if dataType == 'json':
            self.data = json.loads(data)
        elif dataType == 'csv':
            self.data = data
        elif dataType == 'dict':
            self.data = data
        else:
            print("Invalid data type.")

    def generate_metadata(self):
        metadata = {}
        metadata['id'] = str(uuid.uuid4())
        metadata['timestamp'] = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        metadata['job_status'] = 'stored'
        self.metadata = metadata

    def upload_data(self, Key=None):
        if Key is None:
            self.s3_client.put_object(
                Bucket=self.bucket_name, Key=self.metadata['id'], Body=json.dumps(self.data), Metadata=self.metadata)
        else:
            self.s3_client.put_object(
                Bucket=self.bucket_name, Key=Key, Body=json.dumps(self.data), Metadata=self.metadata)
        
    def create_event(self):
        """
        Emits an event to SNS topic to trigger processing of the data
        """

        self.sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:715083127970:DataIngested.fifo',
            Message=json.dumps({'default': json.dumps(self.metadata)}),
            MessageStructure='json',
            MessageGroupId='DataIngested',
            MessageDeduplicationId=self.metadata['id']
        )
