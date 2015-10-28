# -*- coding: UTF-8 -*-
from Tkinter import *
def xinlabel():
	global xin
	s = Label(xin,text = "我爱PYTHON")
	s['background'] = 'blue'
	s.pack()

xin = Tk()
xin['width'] = 600
xin['height'] = 10
b1 = Button(xin,text = "按钮",command = xinlabel) #这种写法先隐藏，使用下面等价写法
# b1 = Button(xin,text = "按钮")
# b1.bind("<Button-1>",xinlabel)
b1['width'] = 50
b1['height']  = 30
b1['background'] = 'red'  #w为什么按钮没有背景颜色
b1.pack()

xin.mainloop()	