const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const Button = document.getElementById("noButton");

yesButton.addEventListener("click", () => {
    onYesClick();
});
noButton.addEventListener("click", () => {
    onNoClick();
});

function onYesClick() {
    alert("you clicked yes");
    window.location.href = '/HSBC_Bot_Server/get_financial_recommendation/';
}

function onNoClick() {
    // alert("you clicked no");
    window.location.href = "/HSBC_Bot_Server/";
    // Remove the question and everything inside the 'questionDiv'
    // var questionDiv = document.getElementById("questionDiv");
    //questionDiv.parentNode.removeChild(questionDiv);

}

function Accept(){
    window.location.href = "/HSBC_Bot_Server/";

}
function Decline(){
    window.location.href = "/ques.html/";

}