let announcerIsOn = false;
let pollingTimeoutId = null;
async function getParticipantCount(quorumCount) {
    try {
        const icon = await getIcon();
        const bubble = await getBubble(icon);
        const numberDiv = await getNumberDiv(bubble);

        console.log('Found number div:', numberDiv.textContent);

        await pollForCount(numberDiv, quorumCount);

        toggleMute();
        announceQuorum();
    } catch (error) {
        console.error(error.message);
    }
}

function pollForCount(numberDiv, targetCount, interval = 250) {
    return new Promise((resolve) => {
        function check() {
            if (! announcerIsOn){
                resolve('quiet time!');
                return;
            }

            const match = numberDiv.textContent.match(/\d+/);
            const count = match ? parseInt(match[0]) : 0;
            console.log(`Current count: ${count}`);

            if (count >= targetCount) {
                resolve();
            } else {
                pollingTimeoutId = setTimeout(check, interval);
            }
        }

        check();
    });
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

function announcerPowerDown() {
    announcerIsOn = false;
    if (pollingTimeoutId) {
        clearTimeout(pollingTimeoutId);
        pollingTimeoutId = null;
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");
        if (request.power === true){
            announcerIsOn = true;
            getParticipantCount(request.count).then((message) => console.log(message));
            sendResponse({message: `announcer has been turned ${request.power ? 'on' : 'off'}, received new count ${request.count}`});
        } else {
            announcerPowerDown();
            sendResponse({message: `announcer has been turned ${request.power ? 'on' : 'off'}`});
        }
    }
);
