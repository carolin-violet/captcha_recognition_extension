from flask import Flask
from utils.orc_util import recognize

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/img_recognition')
def img_recognition():
    img_bytes = ''
    captcha_code = recognize(img_bytes)
    return captcha_code


if __name__ == '__main__':
    app.run()
