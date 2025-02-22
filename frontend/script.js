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
    loadSection('prontoWrapper');
});

function loadSection(section) {
    // Map each section to its JSON file
    const sectionMap = {
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
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Use the section key in the received JSON
            document.getElementById('content').innerHTML = generateHTML(data[section] || data);
            highlightCode();
        })
        .catch(error => console.error(`Error loading ${section} documentation:`, error));
}

function generateHTML(doc) {
    // Special handling for prontoWrapper format
    if (doc.pronto_py) {
        return generateProntoWrapperHTML(doc.pronto_py);
    }

    // Regular documentation format
    let html = `
        <div class="documentation-section">
            <h2 class="section-title">${doc.file || 'Documentation'}</h2>
            <div class="section-description">${doc.description || ''}</div>
            <div class="content-wrapper">`;

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

    html += `</div></div>`;
    return html;
}

// Add new function to handle prontoWrapper format
function generateProntoWrapperHTML(doc) {
    let html = `
        <div class="documentation-section">
            <h2 class="section-title">Pronto API Documentation</h2>
            <div class="section-description">${doc.description}</div>
            <div class="content-wrapper">`;

    // Generate HTML for each category of functions
    for (const [category, functions] of Object.entries(doc.functions)) {
        html += `
            <div class="category-section">
                <h3 class="category-title">${formatCategoryTitle(category)}</h3>
                <div class="functions-grid">`;

        // Generate HTML for each function in the category
        for (const [funcName, funcData] of Object.entries(functions)) {
            html += `
                <div class="function-card">
                    <h4 class="function-name">${funcName}</h4>
                    <div class="function-description">${funcData.description}</div>
                    ${generateProntoParametersHTML(funcData.parameters)}
                    ${generateProntoEndpointHTML(funcData.endpoint)}
                    ${generateProntoExampleHTML(funcData.example)}
                </div>`;
        }

        html += `</div></div>`;
    }

    html += `</div></div>`;
    return html;
}

function formatCategoryTitle(category) {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function generateProntoParametersHTML(parameters) {
    if (!parameters || parameters.length === 0) return '';
    
    return `
        <div class="parameters-section">
            <h5>Parameters</h5>
            <div class="parameters-list">
                ${parameters.map(param => `
                    <div class="parameter-item">
                        <span class="parameter-name">${param}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function generateProntoEndpointHTML(endpoint) {
    if (!endpoint) return '';
    
    return `
        <div class="endpoint-section">
            <h5>Endpoint</h5>
            <div class="endpoint-info">
                <code>${endpoint}</code>
            </div>
        </div>`;
}

function generateProntoExampleHTML(example) {
    if (!example) return '';
    
    return `
        <div class="example-section">
            <h5>Example</h5>
            <div class="example-info">
                <pre><code class="language-python">${example}</code></pre>
            </div>
        </div>`;
}

function generateFunctionsHTML(functions) {
    let html = `<div class="functions-section">
        <h3 class="subsection-title">Functions</h3>
        <div class="functions-grid">`;

    functions.forEach(func => {
        html += `
            <div class="function-card">
                <h4 class="function-name">${func.name}</h4>
                <div class="function-description">${func.description}</div>
                ${generateParametersHTML(func.parameters)}
                ${generateReturnsHTML(func.returns)}
            </div>`;
    });

    html += `</div></div>`;
    return html;
}

function generateParametersHTML(parameters) {
    if (!parameters || parameters.length === 0) return '';
    
    return `
        <div class="parameters-section">
            <h5>Parameters</h5>
            <div class="parameters-list">
                ${parameters.map(param => `
                    <div class="parameter-item">
                        <span class="parameter-name">${param.name}</span>
                        <span class="parameter-type">${param.type}</span>
                        <div class="parameter-description">${param.description}</div>
                        ${param.optional ? '<span class="parameter-optional">Optional</span>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function generateReturnsHTML(returns) {
    if (!returns) return '';
    
    return `
        <div class="returns-section">
            <h5>Returns</h5>
            <div class="returns-info">
                <span class="returns-type">${returns.type}</span>
                <div class="returns-description">${returns.description}</div>
            </div>
        </div>`;
}

function generateClassesHTML(classes) {
    let html = `<div class="classes-section">
        <h3 class="subsection-title">Classes</h3>
        <div class="classes-grid">`;

    classes.forEach(cls => {
        html += `
            <div class="class-card">
                <h4 class="class-name">${cls.name}</h4>
                <div class="class-description">${cls.description}</div>
                ${cls.constructor ? generateConstructorHTML(cls.constructor) : ''}
                ${cls.methods ? generateMethodsHTML(cls.methods) : ''}
            </div>`;
    });

    html += `</div></div>`;
    return html;
}

function generateConstructorHTML(constructor) {
    return `
        <div class="constructor-section">
            <h5>Constructor</h5>
            ${generateParametersHTML(constructor.parameters)}
        </div>`;
}

function generateMethodsHTML(methods) {
    let html = `<div class="methods-section">
        <h5>Methods</h5>
        <div class="methods-list">`;

    methods.forEach(method => {
        html += `
            <div class="method-item">
                <h6 class="method-name">${method.name}</h6>
                <div class="method-description">${method.description}</div>
                ${generateParametersHTML(method.parameters)}
                ${generateReturnsHTML(method.returns)}
            </div>`;
    });

    html += `</div></div>`;
    return html;
}

function generateVariablesHTML(variables) {
    let html = `<div class="variables-section">
        <h3 class="subsection-title">Variables</h3>
        <div class="variables-grid">`;

    variables.forEach(variable => {
        html += `
            <div class="variable-card">
                <h4 class="variable-name">${variable.name}</h4>
                <span class="variable-type">${variable.type}</span>
                <div class="variable-description">${variable.description}</div>
            </div>`;
    });

    html += `</div></div>`;
    return html;
}

function generateEventListenersHTML(eventListeners) {
    let html = `<div class="event-listeners-section">
        <h3 class="subsection-title">Event Listeners</h3>
        <div class="event-listeners-grid">`;

    eventListeners.forEach(listener => {
        html += `
            <div class="event-listener-card">
                <h4 class="event-name">${listener.event}</h4>
                <div class="event-description">${listener.description}</div>
                <div class="event-handler">
                    <pre><code class="language-javascript">${listener.handler}</code></pre>
                </div>
            </div>`;
    });

    html += `</div></div>`;
    return html;
}

// Add this function to highlight code after content is loaded
function highlightCode() {
    Prism.highlightAll();
}
