marker  = [0xCB, 0xFF, 0xFF]
outside = [0xB9, 0xC1, 0xFF]


def diff(x, y):
    a = min(x, y)
    b = max(x, y)
    return b - a

R = diff(marker[0], outside[0])
G = diff(marker[1], outside[1])
B = diff(marker[2], outside[2])

total = R + G + B


js_R = int(R/total*255)
js_G = int(G/total*255)
js_B = int(B/total*255)

print(js_R, js_G, js_B, js_R + js_G + js_B)

