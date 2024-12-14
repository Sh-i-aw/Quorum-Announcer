document.addEventListener('DOMContentLoaded', () => {
    const countInput = document.querySelector('#quorumCount');

    const announcerToggle = document.querySelector('#announcerToggle');

    announcerToggle.addEventListener('change', () => {
        if (announcerToggle.checked){
            let quorumVal = countInput.value;
            // Get the active tab
            (async () => {
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                const response = await chrome.tabs.sendMessage(tab.id, {type: "toggle", power: true, count: quorumVal});
                // do something with response here, not outside the function
                alert(response.message);
            })();
        }
    });
});