---
title: 验证码识别插件(二)-后端开发
id: 63d74102-a133-42df-a81e-20688f5c24ae
date: 2024-12-13 16:53:39
auther: carolin-violet
cover: /upload/anime_picture/73y81e.webp
excerpt: 代码目录 |-app.py|-utils|	|-orc_util.py 依赖 ddddocr==1.5.6Flask==3.1.0Flask_Cors==5.0.0python > 3.8pyinstallerpipreqs 代码 app.py from flask import F
permalink: /archives/yan-zheng-ma-shi-bie-cha-jian-er--hou-duan-kai-fa
categories:
 - xiang-mu
tags: 
 - flask
 - python
---

## 代码目录

    |-app.py
    |-utils
    |	|-orc_util.py

## 依赖

    ddddocr==1.5.6
    Flask==3.1.0
    Flask_Cors==5.0.0
    
    python > 3.8
    pyinstaller
    pipreqs 

## 代码

app.py

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
    

orc\_util.py

    import ddddocr
    
    
    def recognize(img_file):
        ocr = ddddocr.DdddOcr()
        res = ocr.classification(img_file)
        return res
    
    
    if __name__ == '__main__':
        with open('11.png', 'rb') as f:
            img_bytes = f.read()
        r = recognize(img_bytes)
        print(r)
    

## 导出依赖

使用pipreqs生成requirements.txt

    # 安装
    pip install pipreqs
    # 在当前目录生成
    pipreqs . --encoding=utf8 --force

## 打包

使用命令 pyinstaller打包一个代码目录

    pip install pyinstaller 
    pyinstaller -D app.py 

目前只有使用-D参数打包是没有太大问题的，除了ddddocr里面的模型没打包进来需要手动创文件夹丢进来