const speech = {
    init: () => {
        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = config.speech.credentials.region; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.speech.credentials.identityPoolId,
        });

        // Create the Polly service object and presigner object
        this.polly = new AWS.Polly({apiVersion: '2016-06-10'});
        this.signer = new AWS.Polly.Presigner(config.speech.parameters, this.polly);

        this.player = document.createElement('audio');
        this.player.setAttribute('style', 'display:none;');
        this.source = document.createElement('source');
        this.source.setAttribute('src','');
        this.player.appendChild(this.source);
        document.body.appendChild(this.player)
    },

    speakText: (text) => {
        if (this.error) return;

        config.speech.parameters.Text = '<speak><prosody pitch="' + config.speech.pitch + '">' + text + '</prosody></speak>';
    
        // Create presigned URL of synthesized speech file
        this.signer.getSynthesizeSpeechUrl(config.speech.parameters, function(error, url) {
            if (error) {
                this.error = true;
            } else {
                this.source.src = url;
                this.player.load();
                this.player.play();
            }
        });
    }
}

if (config.speech.enable) {
    document.addEventListener('DOMContentLoaded', speech.init, false);    
}
