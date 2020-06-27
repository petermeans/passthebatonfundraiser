function handleClientLoad() {
    gapi.load("client", initClient);
}

// Array of API discovery doc URLs for APIs used by this project
var DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let gapiReady = false;

function initClient() {
    gapi.client
        .init({
            apiKey: 'AIzaSyAHgDOAVNvohloNBfV19ojg3QioYeh1_WI',
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        })
        .then(()=>{
            gapiReady = true;
            // function () {
            //   listMajors();
            // },
            // function (error) {
            //   handleError(error);
            // }
        }
        );
}
