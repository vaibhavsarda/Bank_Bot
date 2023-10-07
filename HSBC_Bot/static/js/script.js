
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const startListeningButton = document.getElementById("start-voice");
const chatLog = document.getElementById("chat-input");

let userText = null;
let inputTimer = null; // Timer to track user input pauses
const output = document.getElementById('recognized-text');

// Function to add a message to the chat log
function addMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = sender;
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
}

function onYesClick(){
    alert("you clicked yes");
             //write the code here
             $.ajax({
                type: 'GET',
                url: '/HSBC_Bot_Server/get_financial_recommendation/',
                data: {
                    'text': userText
                },
                success: (res)=> {
                    response = res.data;
                    pElement.textContent = response.trim();
                    speakAiResponse(response);
                    startListeningButton.style.display = "block";
                    
                },
                error: ()=> {
                    console.log("There was an error");
                    pElement.classList.add("error");
                    response = "Oops! Something went wrong while retrieving the response. Please try again.";
                    pElement.textContent = response;
                    speakAiResponse(response);
                    startListeningButton.style.display = "block";
                   
                }
            });
          
}
function redirectToPage(url) {
    // Use the window.location.href property to navigate to the specified URL
    window.location.href = url;
  }

function onNoClick() {
    alert("you clicked no");
    $.ajax({
        type: 'GET',
        url: '/HSBC_Bot_Server/',
        data: {
            'text': userText
        },
        success: (res)=> {
            response = res.data;
           
            
        },
        error: ()=> {
            console.log("There was an error");
           
           
        }
    });

        // Remove the question and everything inside the 'questionDiv'
        var questionDiv = document.getElementById("questionDiv");
        questionDiv.parentNode.removeChild(questionDiv);
        // You can add your custom logic here for 'No'.
    }
document.getElementById("yesButton").addEventListener("click", onYesClick);
document.getElementById("noButton").addEventListener("click", onNoClick);

// Event listener for the send button


// Simulate an initial greeting from the bot when the page loads
addMessage("Hello! How can I assist you?", "bot");

// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.onstart = () => {
        output.textContent = 'Listening...';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        output.textContent = 'You said: ' + transcript;
    };

    recognition.onerror = (event) => {
        output.textContent = 'Error occurred: ' + event.error;
    };

    startListeningButton.addEventListener('click', () => {
        recognition.start();
    });
} else {
    output.textContent = 'Speech recognition is not supported in this browser.';
}

const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>TO ACTIVATE say 'HI LUMOS' </h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p><br>

                        </div>`



    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom of the chat container
}


let recognition;

startListeningButton.addEventListener("click", function () {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        startListeningButton.style.display = "none";
    }
    recognition.onend = () => {
        timeout = setTimeout(() => {
            recognition.stop();
            document.getElementById('stopButton').disabled = true;
            document.getElementById('startButton').disabled = false;
        }, 100);
    };

   /* recognition.onend = function () {
        startListeningButton.style.display = "block";

    }*/

    recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        appendMessage("You: " + transcript, "user");

        chatInput.value = transcript;
        if (window.innerWidth > 800) {
            handleOutgoingChat();
        }

        // Send the user's speech to your backend for processing with GPT-3,
        // and get the AI response.

        // Simulate the AI response (replace with actual response)
        const aiResponse = "This is a sample AI response.";

        appendMessage("Lumos: " + aiResponse, "ai");
    }

    recognition.start();
});

function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;
    messageElement.innerText = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}


const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p");
    let response = null;
  $.ajax({
        type: 'GET',
        url: '/HSBC_Bot_Server/get_gpt_response',
        data: {
            'text': userText
        },
        success: (res)=> {
            response = res.data;
            pElement.textContent = response.trim();
            speakAiResponse(response);
            startListeningButton.style.display = "block";
            
        },
        error: ()=> {
            console.log("There was an error");
            pElement.classList.add("error");
            response = "Oops! Something went wrong while retrieving the response. Please try again.";
            pElement.textContent = response;
            speakAiResponse(response);
            startListeningButton.style.display = "block";
           
        }
    });



    // Remove the typing animation, append the paragraph element, and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const speakAiResponse = (aiResponse) => {
    const speechSynthesis = window.speechSynthesis;
    const aiUtterance = new SpeechSynthesisUtterance(aiResponse);
    aiUtterance.lang = 'en-US';
    speechSynthesis.speak(aiUtterance);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                </div>`;

    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
     // Adjust the height of the input field dynamically based on its content
     chatInput.style.height =  `${initialInputHeight}px`;
     chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);
