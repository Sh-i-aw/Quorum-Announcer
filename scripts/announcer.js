function getIcon() {
    let icon
    do {
        icon = document.querySelector('button[aria-label="People"]');
    } while (!icon)
    return icon;
}

function getBubble(icon) {
    let bubble;
    do {
        bubble = icon.closest('span')?.nextElementSibling;
    } while (!bubble);
    return bubble;
}

function getNumberDiv() {
    let icon = getIcon();
    let bubble = getBubble(icon);

    let numberDiv;
    do {
        numberDiv = bubble.firstElementChild;
    } while (!numberDiv)
    return numberDiv;
}

function getParticipantCount() {
    let numberDiv = getNumberDiv();

    let count;
    do {
        const match = numberDiv.textContent.match(/\d+/);
        count = match ? parseInt(match[0]) : 0;
    } while(count < 4)

    announceQuorum();
    // // console.log(`Number of participants: ${count}`);
    // if (count == 54 ) {
    // 	toggleMute();
    //   setTimeout(announceQuorum, 400);
    // } else if (count > 54){
    //   return;
    // } else {
    //   setTimeout(getParticipantCount, 200);
    // }
  }

  function announceQuorum() {

    const message = 'Quorum.';
    const utterance = new SpeechSynthesisUtterance(message);
		utterance.lang = "en-US";
		console.log('got here to announcing');
    window.speechSynthesis.speak(utterance);
  }

  function toggleMute() {
    const event = new KeyboardEvent('keydown', {
      key: 'd',
      code: 'KeyD',
			metaKey: true,
			bubbles: true,
    });

		console.log('got here with unmute');
    document.dispatchEvent(event);
  }

  setTimeout(getParticipantCount, 3500); 