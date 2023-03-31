import s from './speech';

let speech = s();
let messageBox;
let nameTag;

const displayMessage = function(wordList) {
    const charList = wordList.shift();
    messageBox.innerHTML += '<span class="word"></span> ';
    const wordContainers = messageBox.getElementsByClassName('word');
    let currentWord = wordContainers[wordContainers.length - 1];
    displayLetters(charList, wordList, currentWord);
}

const displayLetters = function(charList, wordList, currentWord) {
    if (charList.length) {
        setTimeout(() => {
            const char = charList.shift();
            currentWord.innerHTML += '<span class="letter">' + char + '</span>';
            displayLetters(charList, wordList, currentWord);
        }, config.delayTimer);
    } else if (wordList.length){
        displayMessage(wordList);
    }
};

const start = async function() {
    nameTag = document.getElementById('name').getElementsByClassName('text')[0];
    messageBox = document.getElementById('message').getElementsByClassName('text')[0];

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
            const wordList = message.split(' ').map((word) => word.split('')).filter((word) => word.length);
            messageBox.innerHTML = '';
            if (config.delayTimer > 0) {
                displayMessage(wordList);
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