document.addEventListener('DOMContentLoaded', () => {
    const countInput = document.querySelector('#quorumCount');

    const announcerToggle = document.querySelector('#announcerToggle');

    announcerToggle.addEventListener('change', () => {

        if (! announcerToggle.checked) {
            hollerAtContentScript(false, 0);
        }
        if (announcerToggle.checked){
            // Get the active tab
            hollerAtContentScript(true, countInput.value);
        }
    });
});

async function hollerAtContentScript (power, count){
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {power: power, count: count});
    // do something with response here, not outside the function
    alert(response.message);
}