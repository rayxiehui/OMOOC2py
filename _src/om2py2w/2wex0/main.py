
# -*- coding: UTF-8 -*-
from Tkinter import *
top = Tk()  
top.wm_title("学习python gui")  #窗口标题
w1 = Label(top,text = "一起学编程") #一行文字
w2 = Label(top,text = "第三周了")

w1.pack()  #放置在gui里面
w2.pack()
#进入消息循环
top.mainloop()