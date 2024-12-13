from flask import Flask, request
from flask_cors import CORS
from utils.orc_util import recognize

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/img_recognition', methods=['POST'])
def img_recognition():
    try:
        img_file = request.files['file']
        img_bytes = img_file.read()
        captcha_code = recognize(img_bytes)
        return captcha_code
    except Exception as e:
        return str(e)


if __name__ == '__main__':
    app.run()
