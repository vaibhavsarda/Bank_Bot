const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const startListeningButton = document.getElementById("start-voice");
const stopListeningButton = document.getElementById("stop-listening");
const chatLog = document.getElementById("chat-input");

let userText = null;
const startButton = document.getElementById('start-voice');
const output = document.getElementById('recognized-text');

// JavaScript for handling chat interactions


// Function to add a message to the chat log
function addMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = sender;
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
}

// Event listener for the send button
sendButton.addEventListener("click", function () {
    const userMessage = userInput.value;
    addMessage(userMessage, "user");

    // Send the user's message to the server (or chatbot) for processing here
    // You would typically make an API request to a chatbot service

    // For this example, let's just simulate a response from the chatbot
    setTimeout(function () {
        const botResponse = "This is a sample response from ChatGPT.";
        addMessage(botResponse, "bot");
    }, 1000); // Simulate a delay

    userInput.value = ""; // Clear the user input field
});

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

    startButton.addEventListener('click', () => {
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
                            <h1>LUMOS </h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

let recognition;

startListeningButton.addEventListener("click", function () {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        startListeningButton.style.display = "none";
        stopListeningButton.style.display = "block";
    }

    recognition.onend = function () {
        startListeningButton.style.display = "block";
        stopListeningButton.style.display = "none";
    }

    recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        appendMessage("You: " + transcript, "user");

        console.log("Transcribed text: " + transcript);

        chatInput.value = transcript
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

stopListeningButton.addEventListener("click", function () {
    if (recognition) {
        recognition.stop();
    }
});

function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;
    messageElement.innerText = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
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
        success: (res) => {
            response = res.data;
            pElement.textContent = response.trim();
            // speakAiResponse(response);
            startListeningButton.style.display = "block";
            stopListeningButton.style.display = "block";
        },
        error: () => {
            console.log("There was an error");
            pElement.classList.add("error");
            response = "Oops! Something went wrong while retrieving the response. Please try again.";
            pElement.textContent = response;
            // speakAiResponse(response);
            startListeningButton.style.display = "block";
            stopListeningButton.style.display = "block";
        }
    });

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const speakAiResponse = (aiResponse) => {
    // Synthesize and speak the text
    const speechSynthesis = window.speechSynthesis;
    const aiUtterance = new SpeechSynthesisUtterance(aiResponse);
    aiUtterance.lang = 'en-US';
    speechSynthesis.speak(aiUtterance);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/images/lumo.png" defer" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if (!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);