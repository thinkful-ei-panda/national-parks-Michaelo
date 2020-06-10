'use strict';

const apiKey = 'T5b8cac7Dg1hOhg9S2WTFTZeiaSUeasNrW1iNxG9';
const searchURL ='https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&')
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i=0; i < responseJson.data.length; i++) {
        $('#results-list').append(`
        <li>
            <a href='${responseJson.data[i].url} class='park-heading'>${responseJson.data[i].fullName}</a>
            <p>${responseJson.data[i].addresses[0].line1}</p>
            <p>${responseJson.data[i].addresses[0].line2}</p>
            <p>${responseJson.data[i].addresses[0].line3}</p>
            <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}</p>
            <p>${responseJson.data[i].description}</p>
        </li>`
        );
    }

    $('#results').removeClass('hidden');
}

function getParks (searchTerm, maxResults=10) {
    const params = {
        api_key: apiKey,
        state: searchTerm,
        limit: maxResults
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    console.log(url)

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        .then(responseJson => {
            displayResults(responseJson);
            console.log('displayResults finished running!')
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getParks(searchTerm, maxResults);
});
}

$(watchForm);