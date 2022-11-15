const config = {
    channel: '',
    displayName: '',
    delayTimer: 25,
    speech: {
        enable: false,
        credentials: {
            region: 'us-east-1',
            identityPoolId: ''
        },
        parameters: {
            OutputFormat: 'mp3',
            SampleRate: '16000',
            TextType: 'ssml',
            VoiceId: 'Ivy'
        },
        pitch: 'high'
    }
}