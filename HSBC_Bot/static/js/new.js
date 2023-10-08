const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const accept = document.getElementById("accept");
const decline = document.getElementById("decline");

yesButton.addEventListener("click", () => {
    onYesClick();
});
noButton.addEventListener("click", () => {
    onNoClick();
});

accept.addEventListener("click", () => {
    accept_photo();
});
decline.addEventListener("click", () => {
    decline_photo();
});

function onYesClick() {
    alert("you clicked yes");
    window.location.href = '/HSBC_Bot_Server/get_financial_recommendation/';
}

function onNoClick() {
    alert("you clicked no");
    window.location.href = "/HSBC_Bot_Server/";
    // Remove the question and everything inside the 'questionDiv'
    // var questionDiv = document.getElementById("questionDiv");
    //questionDiv.parentNode.removeChild(questionDiv);

}

function accept_photo(){
    alert("you clicked yes");
    window.location.href = "/HSBC_Bot_Server/get_photo/";

}
function decline_photo(){
    alert("you clicked no");
    window.location.href ='/HSBC_Bot_Server/yes_no_question/';
}

