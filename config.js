let statusBanner;
document.addEventListener('DOMContentLoaded', () => {
    const synth = window.speechSynthesis;
    let voices;

    const countInput = document.querySelector('#quorumCount');
    const announcerToggle = document.querySelector('#announcerToggle');
    const configControls = document.querySelectorAll(".configInput");

    const languageSelect = document.querySelector('#languageSelect');
    const voiceSelect = document.querySelector('#voiceSelect');
    const voiceTest = document.querySelector('#voiceTest');

    statusBanner = document.querySelector('#status');

    if (synth.getVoices().length === 0) {
        synth.addEventListener('voiceschanged', setVoiceOptions);
    } else {
        setVoiceOptions();
    }

    function setVoiceOptions() {
        voices = synth.getVoices();

        //filter all of the voices, select distinct language options.
        const languageOptions = Array.from(new Set(voices.map((v) => v.lang)));
        languageOptions.forEach((language) => {
            languageSelect.options[languageSelect.options.length] = new Option(language, language);
        })

        loadVoiceNames();
    }

    function loadVoiceNames() {
        voiceSelect.innerHTML = '<option>Choose Announce Voice</option>';
        let availableVoices = voices.filter((v) => v.lang.includes(languageSelect.value))

        // voiceSelect.options = availableVoices.map((v) => new Option(v.name, v.name));
        availableVoices.forEach((voice) => {
            voiceSelect.options[voiceSelect.options.length] = new Option(voice.name, voice.name);
        });
    }

    languageSelect.addEventListener('change', () => {
        loadVoiceNames();
    })

    announcerToggle.addEventListener('change', () => {

        if (! announcerToggle.checked) {
            hollerAtContentScript(false, 0, '', statusBanner);
            configControls.forEach((input) => {
                input.disabled = false;
            });
            return;
        }

        hollerAtContentScript(true, countInput.value, voiceSelect.value, statusBanner);
        configControls.forEach((input) => {
            input.disabled = true;
        });

    });

    voiceTest.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance('I am your quorum announcer.');
        utterance.lang = "en-US";

        utterance.voice = voices.find((voice) => voice.name === voiceSelect.value);
        synth.speak(utterance);

    })

});


async function hollerAtContentScript (power, count, voiceName, statusBanner){
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {power, count, voiceName});
    // do something with response here, not outside the function
    statusBanner.innerText = response.message;
}