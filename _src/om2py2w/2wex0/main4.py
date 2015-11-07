# -*- coding: UTF-8 -*-

from Tkinter import *
from sys import argv
script,filename = argv

#先写入txt
def reg():
	s1 = e1.get()
	t1 = len(s1)
	filename1 = open(filename,'w+')
	filename1.write("\n")
	filename1.write(s1)
	filename1.close()
	read()

def read():
	s1 = e1.get()
	t1 = len(s1)
	filename2 = open(filename,'r+')
	text2 = filename2.read()
	te.insert( END,text2)
	e1.delete(0,t1)



root = Tk()
l = Label(root,text = "请写日志：")
l.grid(row = 0,column = 0,sticky = W)

e1 = Entry(root,background = 'red')
e1.grid(row = 0,column=1,sticky = E)

te = Text(root,width =50,height =10)
te.grid(row = 2,column = 0,sticky = W)

button = Button(root,text = "提交",command = reg)
button.grid(row = 1,column = 0,sticky =E)

# text.insert(1.0,'22222')
root.mainloop()
