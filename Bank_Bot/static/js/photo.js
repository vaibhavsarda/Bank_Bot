const accept = document.getElementById("accept");
const decline = document.getElementById("decline");

accept.addEventListener("click", () => {
    accept_photo();
});
decline.addEventListener("click", () => {
    decline_photo();
});

function accept_photo(){
    window.location.href = "/Bank_Bot_Server/get_photo/";

}
function decline_photo(){
    window.location.href ='/Bank_Bot_Server/yes_no_question/';
}
