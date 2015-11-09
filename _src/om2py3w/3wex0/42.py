# -*- coding: UTF-8 -*-

#程序解说
import os

def main():
    print "hello world"

    print "这是Alice\'的问候."
    print "这是Bob\'的问题."

    foo(5,10)

    print '='*10
    print "这将直接执行"+os.getcwd()

    counter = 0
    counter += 1

    food = ['苹果','杏子','李子','梨']
    for i in food:
        print '就喜欢吃:' + i

    print '100'
    for i in range(10):
        print i

def foo(paraml,secondParam):
    res = paraml + secondParam
    print '%s 加 %s 等于 %s' %(paraml,secondParam,res)
    if res < 50:
        print '这个'
    elif (res>=50) and((paraml ==42)or(secondParam == 24)):
        print '那个'
    else :
        print '嗯....'
    return res 
    '''这是多行
    注释....'''

if __name__ == '__main__':
    main()
