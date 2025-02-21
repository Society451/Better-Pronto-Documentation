document.addEventListener('DOMContentLoaded', () => {
    fetch('documentation/documentation.json')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = generateHTML(data.documentation);
        })
        .catch(error => console.error('Error loading documentation:', error));
});

function generateHTML(doc) {
    let html = `<h1>Better Pronto Documentation</h1>`;
    html += `<h2>Overview</h2><p>${doc.overview}</p>`;
    html += generateSectionHTML('Python-JS Bridge', doc.python_js_bridge);
    html += generateSectionHTML('Pronto.py', doc.pronto_py);
    return html;
}

function generateSectionHTML(title, section) {
    let html = `<h2>${title}</h2><p>${section.description}</p>`;
    if (section.implementation) {
        html += `<h3>Implementation</h3><pre>${JSON.stringify(section.implementation, null, 2)}</pre>`;
    }
    if (section.functions) {
        html += `<h3>Functions</h3>`;
        for (const [funcCategory, funcs] of Object.entries(section.functions)) {
            html += `<h4>${funcCategory}</h4>`;
            for (const [funcName, funcDetails] of Object.entries(funcs)) {
                html += `<h5>${funcName}</h5><p>${funcDetails.description}</p>`;
                html += `<pre>Parameters: ${JSON.stringify(funcDetails.parameters)}</pre>`;
                html += `<pre>Example: ${funcDetails.example}</pre>`;
            }
        }
    }
    return html;
}
