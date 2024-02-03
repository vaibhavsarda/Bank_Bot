const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const playButton = document.getElementById('play');
const askMeButton = document.getElementById('ask_me');

let output = document.getElementById('output');
let audioRecorder;
let audioChunks = [];
let transcript = "";


document.addEventListener('DOMContentLoaded', function(){
    askMeButton.addEventListener('click', () => call_gpt());
});

navigator.mediaDevices.getUserMedia({ audio: true })
 .then(stream => {

    // Initialize the media recorder object
    audioRecorder = new MediaRecorder(stream);

    // dataavailable event is fired when the recording is stopped
    audioRecorder.addEventListener('dataavailable', e => {
       audioChunks.push(e.data);
    });

    // start recording when the start button is clicked
    startButton.addEventListener('click', () => {
       audioChunks = [];
       audioRecorder.start();
       output.innerHTML = 'Recording started! Speak now.';
    });

    // stop recording when the stop button is clicked
    stopButton.addEventListener('click', () => {
       audioRecorder.stop();
       output.innerHTML = 'Recording stopped! Click on the play button to play the recorded audio.';
    });

    // play the recorded audio when the play button is clicked
    playButton.addEventListener('click', () => {
       const blobObj = new Blob(audioChunks, { type: 'audio/webm' });
       const audioUrl = URL.createObjectURL(blobObj);
       const audio = new Audio(audioUrl);
       audio.play();
       output.innerHTML = 'Playing the recorded audio!';

       runSpeechRecog();
    });
 }).catch(err => {

    // If the user denies permission to record audio, then display an error.
    console.log('Error: ' + err);
 });

// function to convert speech to text
runSpeechRecog = () => {
    document.getElementById("textOutput").innerHTML = "Loading text...";

    var textOutput = document.getElementById('textOutput');
    var action = document.getElementById('action');
    let recognization = new webkitSpeechRecognition();

    recognization.onstart = () => {
       action.innerHTML = "Listening...";
    }

    recognization.onresult = (e) => {
       transcript = e.results[0][0].transcript;
       textOutput.innerHTML = transcript;
       textOutput.classList.remove("hide")
       action.innerHTML = "";
    }
    recognization.start();
}

function call_gpt() {
    var gptOutput = document.getElementById('gptOutput');
    console.log()
    $.ajax({
        type: 'GET',
        url: '/Bank_Bot_Server/get_gpt_response',
        data: {
            'text': transcript
        },
        success: (res)=> {
            let response = res.data
            gptOutput.innerHTML = response
        },
        error: ()=> {
            console.log("There was an error")
        }
    });
}
