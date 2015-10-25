#!/usr/bin/env python 
# -*- coding: cp936 -*- 

from sys import argv
script,filename = argv

txt = open(filename,'r+')

print "here's your file %r:" % filename

print txt.read()
print "now,you can type a line!"

line1 = raw_input("input:")
txt.write(line1)
txt.write("\n")
print txt.read()
txt.close()
print "open again"
txt2 = open('谢辉.txt','r+')
print txt2.read()
