document.addEventListener('DOMContentLoaded', () => {
    const countInput = document.querySelector('#quorumCount');

    countInput.addEventListener('change', () => {
        let quorumVal = countInput.value;
        // Get the active tab
        (async () => {
            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            const response = await chrome.tabs.sendMessage(tab.id, {count: quorumVal});
            // do something with response here, not outside the function
            alert(response.message);
        })();

        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     const activeTab = tabs[0];
        //
        //     // Send a message to the content script
        //     chrome.tabs.sendMessage(activeTab.id,'howdy', (response) => {
        //         if (chrome.runtime.lastError) {
        //             console.error(chrome.runtime.lastError.message);
        //             return;
        //         }
        //
        //         alert(response);
        //     });
        // });
    });
});