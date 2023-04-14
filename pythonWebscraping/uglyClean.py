import numpy
import pandas
import csv

sFull = numpy.empty(0)
lFull = numpy.empty(0)
eFull = numpy.empty(0)
aFull = numpy.empty(0)
for i in range (1, 40):
    speakers = numpy.empty(0)
    lineSp = numpy.empty(0)
    episode = numpy.empty(0)
    arc = numpy.empty(0)
    with open(f'test{i}.txt') as f:
        lines = f.readlines()
        for line in lines:
            if "Preview of Next Episode" in line:
                break
            #print (line)
            if line != '\n':
                line = line.replace(u'\xa0', u' ')
                s = line.split(":  ")
                #print (s)
                if (len(s) < 2):
                    s = s[0].strip()
                    if s != "\n" and lineSp.size > 0:
                        lineFin = lineSp[-1] + s
                        lineSp = lineSp[:-1]
                        lineSp = numpy.append(lineSp, lineFin)
                    elif lineSp.size == 0:
                        lineSp = numpy.append(lineSp, s)
                else:
                    #print (s[1].split("\n")[0])
                    speakers = numpy.append (speakers, s[0])
                    lineSp = numpy.append(lineSp, s[1].split("\n")[0])
                    episode = numpy.append(episode, int(i))
                    if (i < 14):
                        arc = numpy.append(arc, int(1))
                    elif (i < 25):
                        arc = numpy.append(arc, int(2))
                    elif (i< 34):
                        arc = numpy.append(arc,int(3))
                    else:
                        arc = numpy.append(arc, int(4))
    lineSp = lineSp[1:]
    #pandas.DataFrame(speakers).to_csv("Uspeak.csv", header=None, index=None)
    #pandas.DataFrame(lineSp).to_csv("Uline.csv", header=None, index=None)
    sFull = numpy.append(sFull, speakers)
    lFull = numpy.append(lFull, lineSp)
    eFull = numpy.append(eFull, episode)
    aFull = numpy.append(aFull, arc)
pandas.DataFrame(numpy.column_stack((sFull, lFull, eFull, aFull))).to_csv(f"UtFullmEA.csv", header=None, index=None)