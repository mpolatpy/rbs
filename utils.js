const BASE_URL = 'https://api.github.com/search/users';

export async function fetchData(query, numOfResults) {
    const queryUrl = getQueryUrl(query, numOfResults)
    let data = [];

    try {
        const res = await fetch(queryUrl);
        if (res.ok) {
            const json = await res.json();
            data = json.items.map(item => ({ text: item.login, value: item.id }))
        }
    } catch (error) {
        console.log(error)
    }

    return data;
}

function getQueryUrl (query, numOfResults){
    return `${BASE_URL}?q=${query}&per_page=${numOfResults}`;
}