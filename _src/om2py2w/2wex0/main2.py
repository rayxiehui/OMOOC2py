# -*- coding: UTF-8 -*-
from Tkinter import *
root = Tk()
li = ['c','python','php','html','sql','java']
movie = ['css','jquery','bootstrap']
listb = Listbox(root)
listb2 = Listbox(root)
for item in li :
	listb.insert(0,item)

for item in movie :
    listb2.insert(0,item)

def callback():
    print "click!"    

button = Button(root,text = "ok",command=callback) 
# button.insert("jjj谢辉")   

listb.pack()
listb2.pack()
button.pack()
root.mainloop()    	