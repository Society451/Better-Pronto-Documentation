document.addEventListener('DOMContentLoaded', () => {
    fetch('documentation/prontoWrapper.json')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = generateHTML(data.pronto_py);
        })
        .catch(error => console.error('Error loading documentation:', error));
});

function generateHTML(doc) {
    let html = `<h1>Pronto Wrapper Documentation</h1>`;
    html += `<h2>Description</h2><p>${doc.description}</p>`;
    html += generateFunctionsHTML(doc.functions);
    return html;
}

function generateFunctionsHTML(functions) {
    let html = `<h2>Functions</h2>`;
    for (const [funcCategory, funcs] of Object.entries(functions)) {
        html += `<h3>${funcCategory}</h3>`;
        for (const [funcName, funcDetails] of Object.entries(funcs)) {
            html += `<h4>${funcName}</h4><p>${funcDetails.description}</p>`;
            html += `<pre>Parameters: ${JSON.stringify(funcDetails.parameters)}</pre>`;
            html += `<pre>Example: ${funcDetails.example}</pre>`;
            html += `<pre>Endpoint: ${funcDetails.endpoint}</pre>`;
        }
    }
    return html;
}
