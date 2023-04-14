from bs4 import BeautifulSoup

# Importing the HTTP library
import requests as req
import numpy
import pandas as pd 
import csv
  
# Requesting for the website
for i in range (1, 40):
    if i >= 10:
        html_doc = req.get(f'https://ohtori.nu/scripts/Episode_{i}.htm')
    else:
        html_doc = req.get(f'https://ohtori.nu/scripts/Episode_0{i}.htm')

    if html_doc:
        # Creating a BeautifulSoup object and specifying the parser
        S = BeautifulSoup(html_doc.content , 'html.parser')
        #with open('c.csv', 'w', newline='') as csvfile:
        #    spamwriter = csv.writer(csvfile, delimiter=' ')
        #    spamwriter.writerow(html_doc.content)
    
        # Using the prettify method
        #print(S.prettify())

        #listOfBold =  S.find_all('div', class_='poem'); 
        #print(S)
        t =  S.get_text()
        #t = S.split("SCRIPT")
        trans = t.split("SCRIPT")
        #transcript = trans[6].split("Title:  Preview of Next Episode")[0]
        info = trans[6].split(":  ")
        print (info)
        with open(f'test{i}.txt', 'w') as f:
            f.writelines(info)
    else:
        print("fail")