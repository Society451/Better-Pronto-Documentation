document.addEventListener('DOMContentLoaded', () => {
    loadSection('overview', 'documentation/documentation.json', 'documentation');
    loadSection('prontoWrapper', 'documentation/prontoWrapper.json', 'pronto_py');
    loadSection('websockets', 'documentation/websockets.json', 'websockets');
    loadSection('verificationCode', 'documentation/verificationCode.json', 'verificationCode');
    loadSection('systemcheck', 'documentation/systemcheck.json', 'systemcheck');
    loadSection('readjson', 'documentation/readjson.json', 'readjson');
    loadSection('main', 'documentation/main.json', 'main');
    loadSection('login', 'documentation/login.json', 'login');
    loadSection('chat', 'documentation/chat.json', 'chat');
});

function loadSection(sectionId, jsonFilePath, jsonKey) {
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            const section = document.getElementById(sectionId);
            section.innerHTML = generateHTML(data[jsonKey]);
        })
        .catch(error => console.error(`Error loading ${sectionId} documentation:`, error));
}

function generateHTML(doc) {
    let html = `<h2>${doc.description || 'Description'}</h2>`;
    if (doc.functions) {
        html += generateFunctionsHTML(doc.functions);
    }
    if (doc.classes) {
        html += generateClassesHTML(doc.classes);
    }
    return html;
}

function generateFunctionsHTML(functions) {
    let html = `<h3>Functions</h3>`;
    for (const [funcCategory, funcs] of Object.entries(functions)) {
        html += `<h4>${funcCategory}</h4>`;
        for (const [funcName, funcDetails] of Object.entries(funcs)) {
            html += `<h5>${funcName}</h5><p>${funcDetails.description}</p>`;
            html += `<pre>Parameters: ${JSON.stringify(funcDetails.parameters)}</pre>`;
            html += `<pre>Example: ${funcDetails.example}</pre>`;
            if (funcDetails.endpoint) {
                html += `<pre>Endpoint: ${funcDetails.endpoint}</pre>`;
            }
        }
    }
    return html;
}

function generateClassesHTML(classes) {
    let html = `<h3>Classes</h3>`;
    for (const classDetails of classes) {
        html += `<h4>${classDetails.name}</h4><p>${classDetails.description}</p>`;
        if (classDetails.methods) {
            html += `<h5>Methods</h5>`;
            for (const method of classDetails.methods) {
                html += `<h6>${method.name}</h6><p>${method.description}</p>`;
                html += `<pre>Parameters: ${JSON.stringify(method.parameters)}</pre>`;
                html += `<pre>Returns: ${JSON.stringify(method.returns)}</pre>`;
            }
        }
    }
    return html;
}
