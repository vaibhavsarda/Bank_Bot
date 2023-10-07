fetch('/static/financial_questionnaire.json')
    .then((questionnaire) => {
        return questionnaire.json();
    })
    .then((data) => {
        askPersonaQuestions(data);
    })
    .catch(error => {
        console.log(error.message);
        error.message;
    });

function askPersonaQuestions(data) {
    let questionnaire = data["questionnaire"];
    let questionNum = 0;

    console.log(questionnaire[questionNum]["question"]);
    handleBotChat(questionnaire[questionNum]["question"]);
}

// OLD CODE
// OLD CODE
// OLD CODE
// OLD CODE
// OLD CODE

//fetchQuestionnaire()
//    .then((data) => {
//        console.log("FETCH");
//        console.log(data);
//        updateQuestionnaireModal(data);
//        return data;
//    })
//    .catch(error => {
//        console.log(error.message);
//        error.message;
//    });
//
//async function fetchQuestionnaire() {
//    // Get questions from financial_questionnaire file
//    const questionnaire = await fetch('/static/financial_questionnaire.json');
//
//    if(!response.ok) {
//        const message = `An error has occurred: ${response.status}`;
//        console.log(message);
//        throw new Error(message);
//    }
//
//    const data = await questionnaire.json();
//    console.log("QUESTIONNAIRE:");
//    console.log(data);
//    return data;
//}

// JavaScript for updating financial questionnaire modal
//function updateQuestionnaireModal(data) {
//
//    let questionNum = 0;
//    let questionnaire = data["questionnaire"];
//
//    console.log("UPDATE QUESTIONNAIRE MODEL");
//    console.log(questionnaire);
//
//    // Add click listener for next button
//    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
//        clickNextButton(questionnaire, questionNum);
//    });
//
//    // Add click listener for previous button
//    document.getElementById('previousQuestionBtn').addEventListener('click', () => {
//        clickBackButton(questionnaire, questionNum);
//    });
//}
//
//function clickNextButton(questionnaire, questionNum) {
//    // Check the answer here (you can implement your logic)
//    const answer = document.querySelector('.answer-input').value;
//    let currentQuestion = questionnaire[questionNum];
//    console.log(`Question: ${currentQuestion} answer: ${answer}`);
//
//    // Update the question number and question text (replace with your questions)
//    questionNum++;
//    document.querySelector('.question-number').textContent = `Question ${questionNum}`;
//    document.querySelector('.question').textContent = `Question ${questionNum}: ${currentQuestion}`;
//
//    // Clear the answer input field
//    document.querySelector('.answer-input').value = '';
//}
//
//function clickBackButton(questionnaire, questionNum) {
//    // Check the answer here (you can implement your logic)
//    const answer = document.querySelector('.answer-input').value;
//    let currentQuestion = questionnaire[questionNum];
//    console.log(`Question ${currentQuestion} answer: ${answer}`);
//
//    // Update the question number and question text (replace with your questions)
//    currentQuestion--;
//    document.querySelector('.question-number').textContent = `Question ${questionNum}`;
//    document.querySelector('.question').textContent = `Question ${questionNum}: ${currentQuestion}`;
//
//    // Clear the answer input field
//    document.querySelector('.answer-input').value = '';
//}

// END OLD CODE
// END OLD CODE
// END OLD CODE
// END OLD CODE
// END OLD CODE

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
                            <h1>Welcome to FinRec</h1>
                            <p>I will ask some questions to understand you<br> and provide you personalized recommendations.</p>
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
        // stopListeningButton.style.display = "block";
    }

    recognition.onend = function () {
        // startListeningButton.style.display = "block";
        stopListeningButton.style.display = "none";
    }

    recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        appendMessage("You: " + transcript, "user");

        console.log("Transcribed text: "+transcript);

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
        success: (res)=> {
            response = res.data;
            pElement.textContent = response.trim();
            speakAiResponse(response);
            startListeningButton.style.display = "block";
            stopListeningButton.style.display = "block";
        },
        error: ()=> {
            console.log("There was an error");
            pElement.classList.add("error");
            response = "Oops! Something went wrong while retrieving the response. Please try again.";
            pElement.textContent = response;
            speakAiResponse(response);
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

// Convert text to speech
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

// Show typing animation
const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/images/chatbot.jpg" defer" alt="chatbot-img">
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

// Display outgoing chat
const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

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
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

function handleBotChat(botText) {

    botTextTrimmed = botText.trim(); // Remove extra spaces from botText
    if(!botTextTrimmed) return; // If botText is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/images/chatbot.jpg" alt="bot-img">
                        <p>${botTextTrimmed}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
//    chatContainer.querySelector(".default-text")?.remove();
//    chatContainer.appendChild(outgoingChatDiv);
//    chatContainer.scrollTo(0, chatContainer.scrollHeight);
//    setTimeout(showTypingAnimation, 500);

}

// Handle event when user switches themes
themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

// Handle event when user is typing
chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle event when user presses Enter
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