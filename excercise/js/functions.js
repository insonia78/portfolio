function clearGeneration() {
    inputNumber.value = "";
}

function getInput(event) {

    text.innerText = ""
    const number = event.target.value;
    const section = document.getElementById("section");
    let childP = section.lastElementChild.tagName;

    if (childP === "P")
        section.lastElementChild.remove();

    if (!isNaN(number)) {
        createChildDivs(parseInt(number)); return;
    }

    childP = document.createElement('p');
    childP.innerText = "VALUE IS NOT A NUMBER!";
    childP.style.fontSize = "1.5em";
    childP.style.color = "red";
    section.appendChild(childP);

}

function createChildDivs(numberOfDivs) {

    container.innerHTML = "";
    for (let i = 0; i < numberOfDivs; i++) {
        const childDiv = document.createElement('div');
        childDiv.classList.add('child');

        childDiv.textContent = i;
        childDiv.style.minWidth = "2em";
        childDiv.style.width = "auto";
        childDiv.style.minHeight = "2em";
        childDiv.style.margin = "0.5em";
        childDiv.style.height = "auto";
        childDiv.style.fontSize = "2em";
        childDiv.style.display = "flex";
        childDiv.style.alignItems = "center";
        childDiv.style.justifyContent = "center";
        childDiv.style.backgroundColor = "red";
        childDiv.style.cursor = "pointer";

        childDiv.addEventListener('click', () => setBackground(childDiv, Array.prototype.indexOf.call(childDiv.parentNode.children, childDiv)));
        container.appendChild(childDiv)

    }
}


function setBackground(child, index) {

    if (child.style.backgroundColor !== 'blue') {
        child.style.backgroundColor = 'blue';
        text.innerText = `Turning ON ${index}`;
    } else {
        child.style.backgroundColor = 'red';
        text.innerText = `Turning OFF ${index}`;
    }
}