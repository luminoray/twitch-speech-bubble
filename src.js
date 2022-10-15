let messageBox;
let nameTag;

const displayMessage = (charList) => {
    setTimeout(() => {
        const char = charList.shift().replace(" ", "&nbsp;");
        container.innerHTML += '<span class="letter">' + char + '</span>';
        if (charList.length) {
            displayMessage(charList);
        }
    }, config.delayTimer);
}

const start = () => {
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
            const charList = message.split('');
            messageBox.innerHTML = '';
            if (config.delayTimer > 0) {
                displayMessage(charList);
            } else {
                messageBox.innerHTML = charList.map((char) => '<span class="letter">' + char.replace(" ", "&nbsp;") + '</span>').join('');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', start, false);