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

function toggleMute() {
    const event = new KeyboardEvent('keydown', {
        key: 'd',
        code: 'KeyD',
        metaKey: true,
        bubbles: true,
    });

    document.dispatchEvent(event);
}
