let data
const fetchJSONbtn = document.getElementById('fetchDataButton')

async function loadCmsJson() {
    try {
        const response = await fetch("./example.json")

        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.status}`)
        }

        data = await response.json();
        console.log('JSON loaded successfully: ', data)

        return data;
    } catch (error) {
        console.log(`Error loading JSON: ${error}`)
        return null;
    }
}

function displayJSONdata() {
    const mainTitle = document.getElementById('mainTitle')
    const mainParagraph = document.getElementById('mainParagraph')

    mainTitle.textContent = data.main.title
    mainParagraph.textContent = data.main.paragraph
}

function displayList() {
    const listContainer = document.getElementById('listContainer')
    listContainer.innerHTML = '';

    const projects = Object.values(data.list)

    const listHTML = projects
        .map(project => `
            <div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p>ID: ${project.id}</p>
            </div>
        `)
        .join('');

    listContainer.innerHTML = listHTML;
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadCmsJson();

    
});

fetchJSONbtn.addEventListener('click', () => {
    if (data) {
        displayJSONdata();
        displayList();
    } else {
        console.log('Data not loaded yet, please wait')
    }
})