from flask import Flask, request, jsonify
from .Ingest import APIRequest
from .Store import APIData

app = Flask(__name__)


@app.route('/data', methods=['POST'])
def handle_data():
    payload = request.json
    api_request = APIRequest(
        url=payload['url'], api_key=payload.get('api_key'))
    response_data = api_request.make_request(method='GET', appendKey=True)

    api_data = APIData(
        bucket=payload['bucket'], ACCESS_KEY=payload['ACCESS_KEY'], SECRET_KEY=payload['SECRET_KEY'])
    api_data.load_data(data=response_data, dataType='json')
    api_data.generate_metadata()
    api_data.upload_data()
    api_data.create_event()

    return jsonify(api_data.metadata), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
