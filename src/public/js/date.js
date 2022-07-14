const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

 
document.getElementById("current_date").innerHTML = `
    <input type="hidden" id="año" name="año" value="${year}">
    <input type="hidden" id="mes" name="mes" value="${month}">
    <input type="hidden" id="dia" name="dia" value="${day}">
`;