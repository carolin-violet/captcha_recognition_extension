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
