# WhatsApp-Morning-Assistant
WhatsApp Morning Assistant

This repository has the code for WhatApp Morning Assistant. 
We all like to know some basic things about our day each day and move to different websites and apps, this project brings to you all that in your whatsapp chat. It can be simply used each morning to get all the basic information about the day. 
I have included some things like, 
  1. A quote to cheer you up for the day.
  2. Get your horoscope for the day based on your astrological signs.
  3. Weather Forecast for the day.
  4. What is the day special for ?
  5. News Headlines.

All of the above are scraped using Puppetter and are real time data. These are being scraped at backend and return to you via messages on your phone.

Requirements of the project is : puppetter needs to be installed in the working folder. 
   To install use npm ( npm install puppeteer )

Description of the files:
  1. script.js - It is the main source code and has all the code written in javascript using NodeJs.
  2. LinkDetails.json - This JSON file has all the links which the code automates to get real time data for the user.
  3. quotes.json - This file has some of the popular codes which can be used to cheer up each day.
  4. newsItem.json - After the data is scraped, the data is stored in this file for further use.
  5. allMsgs.json - This file holds the Setup messages, and other required templates for interaction.
  6. run.sh/run.bat - These are executable files used to execute the program. (.sh and .bat files work for Unix and Windows based systems respectively.
  
 Working Demo of the project :
    < insert link here >
    
 You can tweak the time according to your comfort and you are ready to go.
 Cheers.
