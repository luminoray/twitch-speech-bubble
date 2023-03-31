var AWS = require("aws-sdk");

let polly;
let signer;
let player;
let source;
let error;

export default function() {
    let init = function() {
        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = config.speech.credentials.region; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.speech.credentials.identityPoolId,
        });

        // Create the Polly service object and presigner object
        polly = new AWS.Polly({apiVersion: '2016-06-10'});
        signer = new AWS.Polly.Presigner(config.speech.parameters, polly);

        player = document.createElement('audio');
        player.setAttribute('style', 'display:none;');
        source = document.createElement('source');
        source.setAttribute('src','');
        player.appendChild(source);
        document.body.appendChild(player)
    }

    let speakText = function(text) {
        if (error) return;

        const payload = config.speech.parameters;
        payload.Text = '<speak><prosody pitch="' + config.speech.pitch + '">' + text + '</prosody></speak>';
        payload.SampleRate = payload.SampleRate.toString();
    
        // Create presigned URL of synthesized speech file
        signer.getSynthesizeSpeechUrl(payload, function(err, url) {
            if (err) {
                console.log(err);
                error = true;
            } else {
                console.log('good');
                source.src = url;
                player.load();
                player.play();
            }
        });
    }

    return {polly, signer, player, source, error, init, speakText}
}