//******************************************************//
//*****************HELIUM MINER WATCHDOG*****************//
//*************************v1.3*************************//
//***************CREATED BY : FLEECEABLE****************//
//******************************************************//
//**********************CHANGELOG***********************//
//v1.1 - |30.08.21| - When problem with UI and next check everything is OK (also when in sync) notify user. 
//v1.2 - |31.08.21| - Updated error handling when miner IP is not responding
//v1.3 - |02.09.21| - FW version check bug fix. When new firmware, program continuously send notification.


const miner_ip_address = '192.168.1.229'; 						//Miner IP address
const token = ''; 												//Telegram bot token
const chatId = '' 												//Chat or group id
const block_height_back = 10; 									//How many blocks can miner be back from blockchain
const check_time = 3; 											//Cyclical check time in minutes

//************DO NOT EDIT BELOW THIS LINE************

const http = require('http');
const https = require('https');
var block_height_error;
var connecting_error;
var FW_version = '';

sendMessage = 'Helium miner watchdog has been activated...'
https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);

setInterval(function(){		
	let url = "http://" + miner_ip_address + "/?json=true";

	http.get(url,(res) => {
    let body = "";
    if (res.statusCode != 200) {
      console.log("non-200 response status code:", res.statusCode);
      console.log("for url:", url);
	  if (connecting_error != true) {
			console.log('There is problem to load local UI. Reboot your miner...');
			sendMessage = 'There is problem to load local UI. Reboot your miner...';
			https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);
			connecting_error=true;
		}
	
		else {
			if (connecting_error != false) {
					console.log('Miner local UI is responsing...');
					sendMessage = 'Miner local UI is responsing... ';
					https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);
					connecting_error=false;
				}	
			}
      return;
    }

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
			if (json.MH < json.BCH-block_height_back) {
				if (block_height_error != true) {
					sendMessage = 'Miner status: ERROR! - Your miner blockchain height is back more than ' + block_height_back + ' blocks.' + ' Height Status: ' + json.MH + '/' + json.BCH;
					https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);
					console.log('Miner status: ERROR! - Your miner blockchain height is back more than ' + block_height_back + ' blocks.' + ' Height Status: ' + json.MH + '/' + json.BCH);
					block_height_error=true;
				}
			}
			else{
				if (block_height_error != false) {
					console.log('Miner status: OK - Your miner is back on action.' + ' Height Status: ' + json.MH + '/' + json.BCH);
					sendMessage = 'Miner status: OK - Your miner is back on action.' + ' Height Status: ' + json.MH + '/' + json.BCH;
					https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);
					block_height_error=false;
				}
			}
			
			if (FW_version == '') {
				FW_version = json.FW;
				console.log('Miner FW: - Your miner FW version is ' + json.FW);
				sendMessage = 'Miner FW: - Your miner FW version is ' + json.FW;
				https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);
			}
			else {
				if (FW_version != json.FW) {
					FW_version = json.FW;
					console.log('Miner FW UPDATE: - Your miner FW version is updated to ' + json.FW);
					sendMessage = 'Miner FW UPDATE: - Your miner FW version is updated to ' + json.FW;
					https.get('https://api.telegram.org/bot'+ token + '/sendMessage?chat_id=' + chatId + '&text='+ sendMessage);
				}
			}
        } catch (error) {
            console.error(error.message);
		};
    });

	}).on("error", (error) => {
		console.error(error.message);
		});
	//console.log('Checking...');
},check_time*60*1000);//x minutes delay before check again

