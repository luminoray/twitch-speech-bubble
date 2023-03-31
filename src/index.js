import s from './speech';
const tmi = require('tmi.js');

let speech = s();
let messageBox;
let translatedBox;
let nameTag;

const displayMessage = function(wordList, box) {
    const charList = wordList.shift();
    box.innerHTML += '<span class="word"></span> ';
    const wordContainers = box.getElementsByClassName('word');
    let currentWord = wordContainers[wordContainers.length - 1];
    displayLetters(charList, wordList, currentWord, box);
}

const displayLetters = function(charList, wordList, currentWord, box) {
    if (charList.length) {
        setTimeout(() => {
            const char = charList.shift();
            currentWord.innerHTML += '<span class="letter">' + char + '</span>';
            displayLetters(charList, wordList, currentWord, box);
        }, config.delayTimer);
    } else if (wordList.length){
        displayMessage(wordList, box);
    }
};

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const message = JSON.parse(xhttp.responseText).data.translations[0].translatedText;
        const wordList = message.split(' ').map((word) => word.split('')).filter((word) => word.length);
        translatedBox.innerHTML = '';
        if (config.delayTimer > 0) {
            displayMessage(wordList, translatedBox);
        } else {
            translatedBox.innerHTML = wordList.map((word) => '<span class="word">' + word.map((char) => '<span class="letter">' + char + '</span>').join('') + '</span>').join(' ');
        }
    }
};

const start = async function() {
    nameTag = document.getElementById('name').getElementsByClassName('text')[0];
    messageBox = document.getElementById('message').getElementsByClassName('text')[0];
    translatedBox = document.getElementById('message').getElementsByClassName('translated-text')[0];

    if (! config.channel.length && ! config.displayName.length) {
        nameTag.innerHTML = 'Error!';
        messageBox.innerHTML = 'Fill out config.js with your stream\'s data.';
        return;
    }
    
    nameTag.innerHTML = config.displayName;

    const client = new tmi.Client({
        channels: [ config.channel ]
    });
    
    client.connect().catch(console.error);
    client.on('message', (channel, tags, message, self) => {
        if (tags['display-name'] === config.displayName) {
            xhttp.open("GET", "https://translation.googleapis.com/language/translate/v2?" +
                "key=" + config.translation.key + "&" +
                "source=" + config.translation.source + "&" +
                "target=" + config.translation.target + "&" +
                "q=" + encodeURI(message)
            , true);
            xhttp.send();

            const wordList = message.split(' ').map((word) => word.split('')).filter((word) => word.length);
            messageBox.innerHTML = '';
            if (config.delayTimer > 0) {
                displayMessage(wordList, messageBox);
            } else {
                messageBox.innerHTML = wordList.map((word) => '<span class="word">' + word.map((char) => '<span class="letter">' + char + '</span>').join('') + '</span>').join(' ');
            }

            if (config.speech.enable) {
                speech.speakText(message);
            }
        }
    });
}


if (config.speech.enable) {
    document.addEventListener('DOMContentLoaded', speech.init, false);    
}
document.addEventListener('DOMContentLoaded', start, false);