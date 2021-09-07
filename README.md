# Nebra-Helium-Watchdog

If watchdog is useful for you, feel free to dip some HNT. <br>
![image](https://user-images.githubusercontent.com/90242002/132324949-22135e10-5531-447a-a50b-f93de121b63f.png) <br>
14faPbrrcdhNSG2EXiGuox4qkfcWNJmHmYYeSA8s8MvYcAeSxEE<br>

  This document describes how to keep an eye of your Nebra miner.<br>
  Basically it uses hardware (I used Raspberri Pi 3 model B) and operating system where you can run nodejs (You can run it on windows machine also but it needs to be on site 24/7 and running. Video how to use that with PC is here: https://youtu.be/3Tx1FMRcj44 ). Program checks cyclically if miner UI works and takes data from your miner to analyze if everything is okay. Notification is done via Telegram app (IOS and Android). <br>Here is example: <br>
![image](https://user-images.githubusercontent.com/90242002/132312920-946ac422-9b8c-4180-b135-c6a88c61ae07.png) <br>

You will get four type of notifications:
1. Miner watchdog is activated. That means check service is started.
2. Miner block heigh is back more than X blocks. You can change it by yourself.
3. Miner firmware was updated.
4. Miner local UI is not responding. I usually wait 10-15 minutes and if miner status is not changed back to normal, I’ll do physical restart. This usually solves the problem.
By default program checks miner UI every 3 minutes.

<b><h1>Telegram</h1></b><br>
Create a bot using BotFather. Here is video link how to do that:
https://youtu.be/XoryoE9V88E?t=104 <br>
Create a new group and add bot to your group.
Take a group id from browser:<br>
![image](https://user-images.githubusercontent.com/90242002/132314917-2bcb191c-98be-4aa0-91a6-1d0933d51fd9.png)<br>
Test if bot is working with this command:<br><br>
<i><b>https://api.telegram.org/bot<BOT_TOKEN_HERE>/sendMessage?chat_id=<CHAT_ID_HERE>&text=Testing_bot</b></i><br><br>
Change these values <BOT_TOKEN_HERE> and <CHAT_ID_HERE> in link and paste it in your browser.
Hit ENTER.
If you get the message in Telegram you are done in here and can go to change app.js file with notepad or notepad++.<br><br>
  <b><h1>Code, modifications and installation</h1></b><br>
You need to change these lines:<br>
![image](https://user-images.githubusercontent.com/90242002/132315153-d01b1a07-1ec0-4199-b2cb-372a4f50b017.png)

I’m using latest nodejs v16.8.0 and it works fine. <br>
Check this manual if you need step by step tutorial how to setup raspberry pi:
https://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/<br>
When node is installed, copy app.js file to raspberry and run it (node app.js). There is a lot tutorials
how to do that. www.google.com is your best friend.<br>
We want that code will execute automatically after raspberry pi restart or power failure.
I used PM2.<br>
Here are the commands (link to help: https://stackoverflow.com/questions/13385029/automatically-start-forever-node-on-system-restart) <br><br>
  <b>sudo npm install pm2 -g</b> <i>--installs pm2</i><br>
  <b>pm2 start app.js </b><i>--starts application (make sure you are in same directory with app.js file)</i><br>
  <b>pm2 list </b><i>--shows your running application</i><br>
  <b>pm2 startup </b><i>--creates running service to your startup service</i><br><br>
After that you will see pm2 asking to manually run a command, copy and run that.<br>
  <b>pm2 save </b><i>--saves that process and executes that app.js process when startup.</i><br><br>
If you want to stop application then use:<br>
  <b>pm2 stop all </b><i>--stops all applications (we have only one so you can use that command)</i>
