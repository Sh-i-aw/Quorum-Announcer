function announceQuorumSamples() {
    const windowSynth = window.speechSynthesis;
    const message = 'Quorum.';
    let voices = windowSynth.getVoices();

    // voices = voices.filter((voice) => voice.lang.includes('en'));
    console.log('Available voices:', voices);

    let index = 0;

    function speakNextVoice() {
        if (index >= voices.length) {
            console.log('Finished announcing quorum with all voices.');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = voices[index];
        utterance.lang = 'en-US';

        utterance.onend = () => {
            console.log('voice: ' + voices[index].name);
            index++;
            setTimeout(speakNextVoice, 800); // 800 ms delay before the next voice
        };

        windowSynth.speak(utterance);
    }

    speakNextVoice();
}