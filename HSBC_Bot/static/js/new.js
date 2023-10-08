const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");


yesButton.addEventListener("click", () => {
    onYesClick();
});
noButton.addEventListener("click", () => {
    onNoClick();
});



function onYesClick() {
    window.location.href = '/HSBC_Bot_Server/get_financial_recommendation/';
}

function onNoClick() {
    window.location.href = "/HSBC_Bot_Server/";
    // Remove the question and everything inside the 'questionDiv'
    // var questionDiv = document.getElementById("questionDiv");
    //questionDiv.parentNode.removeChild(questionDiv);

}


