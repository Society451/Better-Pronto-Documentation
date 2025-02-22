document.addEventListener('DOMContentLoaded', () => {
    // Listen for clicks on navigation links
    document.querySelectorAll('#taskbar a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const section = event.target.getAttribute('data-section');
            loadSection(section);
        });
    });
    // Load default section
    loadSection('overview');
});

function loadSection(section) {
    // Map each section to its JSON file
    const sectionMap = {
        'overview': 'documentation/documentation.json',
        'prontoWrapper': 'documentation/prontoWrapper.json',
        'websockets': 'documentation/websockets.json',
        'verificationCode': 'documentation/verificationCode.json',
        'systemcheck': 'documentation/systemcheck.json',
        'readjson': 'documentation/readjson.json',
        'main': 'documentation/main.json',
        'login': 'documentation/login.json',
        'chat': 'documentation/chat.json'
    };

    const jsonFilePath = sectionMap[section];
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            // Use the section key in the received JSON
            document.getElementById('content').innerHTML = generateHTML(data);
        })
        .catch(error => console.error(`Error loading ${section} documentation:`, error));
}

function generateHTML(doc) {
    let html = `<h2>${doc.description || 'Description'}</h2>`;
    if (doc.functions) {
        html += generateFunctionsHTML(doc.functions);
    }
    if (doc.classes) {
        html += generateClassesHTML(doc.classes);
    }
    if (doc.variables) {
        html += generateVariablesHTML(doc.variables);
    }
    if (doc.eventListeners) {
        html += generateEventListenersHTML(doc.eventListeners);
    }
    return html;
}

function generateFunctionsHTML(functions) {
    let html = `<h3>Functions</h3>`;
    functions.forEach(func => {
        html += `<h4>${func.name}</h4><p>${func.description}</p>`;
        if (func.parameters) {
            html += `<pre>Parameters: ${JSON.stringify(func.parameters, null, 2)}</pre>`;
        }
        if (func.returns) {
            html += `<pre>Returns: ${JSON.stringify(func.returns, null, 2)}</pre>`;
        }
    });
    return html;
}

function generateClassesHTML(classes) {
    let html = `<h3>Classes</h3>`;
    classes.forEach(cls => {
        html += `<h4>${cls.name}</h4><p>${cls.description}</p>`;
        if (cls.methods) {
            html += `<h5>Methods</h5>`;
            cls.methods.forEach(method => {
                html += `<h6>${method.name}</h6><p>${method.description}</p>`;
                if (method.parameters) {
                    html += `<pre>Parameters: ${JSON.stringify(method.parameters, null, 2)}</pre>`;
                }
                if (method.returns) {
                    html += `<pre>Returns: ${JSON.stringify(method.returns, null, 2)}</pre>`;
                }
            });
        }
    });
    return html;
}

function generateVariablesHTML(variables) {
    let html = `<h3>Variables</h3>`;
    variables.forEach(variable => {
        html += `<h4>${variable.name}</h4><p>${variable.description}</p>`;
        html += `<pre>Type: ${variable.type}</pre>`;
    });
    return html;
}

function generateEventListenersHTML(eventListeners) {
    let html = `<h3>Event Listeners</h3>`;
    eventListeners.forEach(listener => {
        html += `<h4>${listener.event}</h4><p>${listener.description}</p>`;
        html += `<pre>Handler: ${listener.handler}</pre>`;
    });
    return html;
}
