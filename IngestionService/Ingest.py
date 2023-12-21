import os
import requests


class APIRequest():
    """
    Creates a APIRequest object which can make requests to a given URL, with a given API key and headers.


    Raises:
        ValueError: If no API key is provided and the 'API_KEY' environment variable is not set.
        ValueError: If an invalid method is provided for the request.

    Returns:
        json object containing the response from the request.
    """

    def __init__(self, url, api_key=None, headers=None):
        # load_dotenv()
        self.url = url
        self.api_key = api_key if api_key else os.getenv('API_KEY')
        self.headers = headers
        
        if self.api_key is None:
            raise ValueError(
                "No API key provided and 'API_KEY' environment variable is not set.")

    def make_request(self, method, appendKey, data=None):
        method_to_call = getattr(requests, method.lower())
        if not method_to_call:
            raise ValueError(f"Invalid method {method}")

        if appendKey:
            self.url = self.url + '?api_key=' + self.api_key

        try:
            # response = method_to_call(
            #     self.url, headers=self.headers, json=data)
            response = requests.get(self.url, data)
            response.raise_for_status()
        except requests.exceptions.HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')
        except Exception as err:
            print(f'Other error occurred: {err}')
        else:
            return response.json()

