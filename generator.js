//NOTE: "const resume" and "const references" must be defined in resume.js
const contactTypes = ["name", "pronouns", "phone", "email", "city", "address", "other"];
function createResume() {
    if(!resume) showError("resume is not defined");
    if(!resume.contact) showError("resume.contact is not defined");
    if(!resume.experience) showError("resume.experience is not defined");
    if(!resume.experienceTypes) showError("resume.experienceTypes is not defined");
    if(!references) showError("references is not defined");
    //Add default descriptions
    if(!resume.descriptions) resume.descriptions = [];
    resume.descriptions.unshift(
        "<span class=\"hidden\">No Description</span>",
        "<span contenteditable='true'>Enter description</span>");
    //Header contact info
    contactTypes.forEach(id => {
        if(!resume.contact[id]) return;
        $("#" + id)[0].innerText = resume.contact[id];
    })
    let exp = {};
    //Group by type of experience
    for(let i = 0; i < resume.experience.length; i++) {
        let entry = resume.experience[i];
        if(exp[entry.type] == undefined) {exp[entry.type] = [];}
        exp[entry.type].push(entry);
    }
    for(let i in exp) {
        let category = document.createElement("div");
        //Label
        category.appendChild(document.createElement("div"));
        category.children[0].innerText = exp[i][0].type.toUpperCase().replace(/_/g, " ");
        category.children[0].classList.add("experienceType", "header2", i);
        for(let x in exp[i]) {
            let entry = exp[i][x];
            if(entry.veryhidden) continue;
            let out = document.createElement("div");
            out.classList.add("experience");
            let html = `
            <div class='expHead'>
                ${line("title", i, entry.title)}

                ${entry.start ? line("time", i, entry.start.toUpperCase().replace(/ /g, "&nbsp;") + (entry.end ? "&#8209;"/*non-breaking hyphen*/ + entry.end.toUpperCase().replace(/ /g, "&nbsp;") : "")) : ""}
                ${line("company", i, entry.company)}
                </div>
                ${line("desc", i, entry.description)}
                ${line("contact", i, entry.contact)}
            `;
            out.innerHTML = html;
            if(entry.hidden) out.classList.add("hidden");
            category.appendChild(out);
        }
        if(!resume.experienceTypes[i]) showError("Experience type '" + i + "' does not have a set location");
        $("#" + resume.experienceTypes[i])[0].appendChild(category);
    }
    //Create lowercase keys in references
    for(let name in references) {
        references[name.toLowerCase()] = references[name];
    }
    updateReferences();
    blockDynamics();
}
function showError(msg) {
    $("#error").text(msg);
    throw msg;
}
function cycleDescription() {
    //Loop to the next description under name
    let cur = $("#description").html();
    let index = resume.descriptions.indexOf(cur);
    if(index == resume.descriptions.length - 1) index = -1;
    $("#description").html(resume.descriptions[index + 1]);
}
function updateReferences() {
    const lastName = str => str.split(' ').slice(-1)[0];
    //Find contacts that are in non-hidden experiences
    let contacts = [];
    let contactElements = document.getElementsByClassName("contact");
    for(i of contactElements) {
        if(i.parentNode.classList.contains("hidden")) continue
        if(contacts.indexOf(i.innerText) != -1) continue;
        contacts.push(i.innerText);
    }
    //Sort by last name
    contacts.sort((a, b) => lastName(a) < lastName(b) ? -1 : 1);
    //Create list in html
    let html = "";
    for(let name of contacts) {
        let lowerName = name.toLowerCase();
        if(!references[lowerName]) continue;
        html += `<div class='reference experience'>${name} <strong>${references[lowerName]}</strong></div>`;
    }
    //Add references header if necessary
    if(!document.querySelector(".references")) $("#right")[0].innerHTML += "<div class='experienceType header2'>REFERENCES</div><div class='references'></div>";
    document.querySelector(".references").innerHTML = html;
}
function blockClick(event) {
    let target = event.target;
    while(!target.classList.contains("experience")) target = target.parentNode;
    event.preventDefault();
    if(event.button == 0) toggleHide(target);
    if(event.button == 2) moveUp(target);

}
function blockDynamics() {
    const blocks = document.getElementsByClassName("experience");
    for(el of blocks) {
        el.addEventListener("contextmenu", event => event.preventDefault());
        el.addEventListener("mousedown", blockClick);
    }
}
function moveUp(element) {
    if(!element.previousSibling) return;
    if(element.previousSibling.classList.contains("experienceType")) return;
    let newElement = element.cloneNode(true);
    newElement.addEventListener("contextmenu", event => event.preventDefault());
    newElement.addEventListener("mousedown", blockClick);
    element.previousSibling.before(newElement);
    element.parentNode.removeChild(element);
}
function toggleHide(element) {
    element.classList.toggle("hidden");
    updateReferences();
    //Hide category if all are hidden
    let allHidden = Array.from(element.parentNode.children).slice(1).every(el => el.classList.contains("hidden"));
    if(allHidden) element.parentNode.classList.add("hidden");
    else element.parentNode.classList.remove("hidden");
}
function line(name, category, inside) {
    if(!inside) return "";
    return "<span class='" + name + " " + name + "_" + category + "'>" + inside + "</span>";
}
function getURLParameters(url) {
    if(!url) return;
    let parameters = url.split("?")[1].split("&");
    for(let i in parameters) {
        args[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
    }
}
var args = {
};
document.body.onload = function () {
    createResume(resume);
}