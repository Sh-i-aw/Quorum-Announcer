function waitForCondition(conditionFn, interval = 800) {
    return new Promise((resolve) => {
        function check() {
            const result = conditionFn();
            if (result) {
                resolve(result);
            } else {
                setTimeout(check, interval);
            }
        }

        check();
    });
}

async function getIcon() {
    console.log('Trying to get icon');
    return await waitForCondition(() => document.querySelector('button[aria-label="People"]'));
}

async function getBubble(icon) {
    console.log('Trying to get bubble');
    // The arrow function captures `icon` and passes it to `waitForCondition`
    return await waitForCondition(() => icon.closest('span')?.nextElementSibling);
}

async function getNumberDiv(bubble) {
    console.log('Trying to get number div');
    // The arrow function captures `bubble` and passes it to `waitForCondition`
    return await waitForCondition(() => bubble.firstElementChild);
}

async function getParticipantCount() {
    try {
        const icon = await getIcon();
        const bubble = await getBubble(icon);
        const numberDiv = await getNumberDiv(bubble);

        console.log('Found number div:', numberDiv.textContent);

        await pollForCount(numberDiv, 54);

        toggleMute();
        announceQuorum();
    } catch (error) {
        console.error(error.message);
    }
}

function pollForCount(numberDiv, targetCount, interval = 250) {
    return new Promise((resolve) => {
        function check() {
            const match = numberDiv.textContent.match(/\d+/);
            const count = match ? parseInt(match[0]) : 0;
            console.log(`Current count: ${count}`);

            if (count >= targetCount) {
                resolve();
            } else {
                setTimeout(check, interval);
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