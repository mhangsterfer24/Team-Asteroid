import json
import requests
import boto3
import uuid
import pandas as pd
from datetime import datetime
import sqlalchemy
from sqlalchemy import create_engine

class ProcessData:
    def __init__(self, bucket, ACCESS_KEY, SECRET_KEY):
        self.bucket_name = bucket
        self.s3_client = boto3.client(
            's3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
        self.sns_client = boto3.client('sns', region_name='us-east-2', 
                                       aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_KEY)
        self.data = None
        self.metadata = None

    def clean_data(data):
        if dataType == 'json':
            self.data = data.json()
            self.data = dict_df(data)
        elif dataType == 'csv':
            self.data = pd.read_csv(data)
        elif dataType == 'dict':
            self.data = dict_df(data)
        else:
            print("Invalid data type.")

    def dict_df(self, data):
        df = pd.DataFrame.from_dict(data)
        return df

    def download_data(self, bucket, ObjectKey):
        response = self.s3_client.get_object(Bucket=bucket, Key=ObjectKey)
        data = response['Body'].read()
        return data

    def upload_data(self, user, password, host, database, port, tablename, dfs):
        #replace <user>, <password>, <host>, and <port> with your MySQL credentials
        engine = create_engine(f'mysql+pymysql://{user}:{password}@{host}:{port}/{database}')
        #write the DataFrame to a MySQL table using SQLAlchemy
        dfs.to_sql(name=tablename, con=engine, if_exists='replace', index=False)

    def generate_metadata(self):
        metadata = {}
        metadata['id'] = str(uuid.uuid4())
        metadata['timestamp'] = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        metadata['job_status'] = 'processed'
        self.metadata = metadata
    
    def create_event(self):
        """
        Emits an event to SNS topic to trigger processing of the data
        """

        self.sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:715083127970:DataProcessed.fifo',
            Message=json.dumps({'default': json.dumps(self.metadata)}),
            MessageStructure='json',
            # Do I need to make a message group ID?
            MessageGroupId='DataProcessed',
            MessageDeduplicationId=self.metadata['id']
        )
        

    