
function getIcon() {
    let icon
    console.log(`trying to get icon`)
    do {
        icon = document.querySelector('button[aria-label="People"]');
        if (icon) break;
        setTimeout(() => {}, 800);
    } while (!icon)

    return icon;
}

function getBubble(icon) {
    let bubble;
    console.log(`trying to get bubble`)

    do {
        bubble = icon.closest('span')?.nextElementSibling;
        if (bubble) break;
        setTimeout(() => {}, 800);
    } while (!bubble);
    return bubble;
}

function getNumberDiv() {
    let icon = getIcon();
    let bubble = getBubble(icon);

    let numberDiv;
    do {
        numberDiv = bubble.firstElementChild;
        if (numberDiv) break;
        setTimeout(() => {}, 800);
    } while (!numberDiv)
    return numberDiv;
}

function getParticipantCount() {
    let numberDiv = getNumberDiv();

    console.log('found number div')
    let count;
    do {
        const match = numberDiv.textContent.match(/\d+/);
        count = match ? parseInt(match[0]) : 0;
    } while(count < 54)

    toggleMute();
    announceQuorum();
  }

  function announceQuorum() {
    const windowSynth = window.speechSynthesis;
    const message = 'Quorum.';

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";

    function setVoice() {
      let voices = windowSynth.getVoices();
      utterance.voice = voices.find((voice) => voice.name === 'Good News');
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

  function toggleMute() {
    const event = new KeyboardEvent('keydown', {
      key: 'd',
      code: 'KeyD',
			metaKey: true,
			bubbles: true,
    });

    document.dispatchEvent(event);
  }

  setTimeout(getParticipantCount, 3500);