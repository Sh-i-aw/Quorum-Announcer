async function getParticipantCount() {
    try {
        const icon = await getIcon();
        const bubble = await getBubble(icon);
        const numberDiv = await getNumberDiv(bubble);

        console.log('Found number div:', numberDiv.textContent);

        await pollForCount(numberDiv, 55);

        toggleMute();
        announceQuorum();
    } catch (error) {
        console.error(error.message);
    }
}


  function announceQuorum() {
    const windowSynth = window.speechSynthesis;
    const message = 'Quorum.';

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";

    function setVoice() {
      let voices = windowSynth.getVoices();
      utterance.voice = voices.find((voice) => voice.name === 'Fred');
      console.log(utterance.voice);
      windowSynth.speak(utterance);
    }

    // Wait for voices to be loaded
    if (windowSynth.getVoices().length === 0) {
      windowSynth.addEventListener('voiceschanged', setVoice);
    } else {
      setVoice();
    }
  }



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");

        sendResponse({message: `announcer has been turned ${request.power ? 'on' : 'off'}, received new count ${request.count}`});
    }
);

setTimeout(getParticipantCount, 3500);