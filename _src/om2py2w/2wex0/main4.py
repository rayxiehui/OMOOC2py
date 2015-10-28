# -*- coding: UTF-8 -*-
from Tkinter import *

#先写入txt
def reg():
	s1 = e1.get()
	t1 = len(s1)
	filename = open(txt.txt,'r+')
	filename.write("\n")
	filename.write(s1)
	filename.close()
	read()

def read():
	s1 = e1.get()
	t1 = len(s1)
	filename2 = open(txt.txt,'r+')
	text2 = filename2.read()
    te.insert(1.0,'text2')
    e1.delete(0,t1)



root = Tk()
l = Label(root,text = "请写日志：")
l.grid(row = 0,column = 0,sticky = W)

e1 = Entry(root)
e1.grid(row = 0,column=1,sticky = E)

te = Text(root,width =50,height =10)
te.grid(row = 2,column = 0,sticky = W)

button = Button(root,text = "提交"，command = reg)

# text.insert(1.0,'22222')
root.mainloop()
