const googleSheetsModule = (function () {
    const s = {
        sheetId: '1i1C9cPeEW9pKDDV42THQVm2GAE2TX6ReHuiPlTMEDQ8',
        sheetRange: 'ResponsesSheet1!C1:D',
        gapiLoadedPromise: null,
        loading: true,
        dom:{
            $nameBox: $('[data-ui="name-box"]'),
            $contentBox: $('[data-ui="content-box"]'),
            $spinnerBox:$('[data-ui="spinner-box"]')
        }
    }

    const state = {
        sheetData: {
            results: 'not sent',
            raw: null,
            nice: null
        }
    }

    const init = function () {
        console.log('init - go 2')
        s.gapiLoadedPromise = waitForGAPI();
        s.gapiLoadedPromise.then(() => { }, () => {
            console.log('Error: failed to load gapi')
        })
    }

    const waitForGAPI = function (callback) {
        return new Promise((resolve, reject) => {
            let count = 0
            const myInterval = setInterval(() => {
                if (gapiReady) {
                    clearInterval(myInterval)
                    resolve()
                }
                else {
                    count++
                    if (count > 300) {
                        clearInterval(myInterval)
                        reject();
                    }
                }
            }, 100)
        })
    }

    const getSheetData = function () {
        return new Promise((resolve, reject) => {
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: s.sheetId,
                range: s.sheetRange
            }).then(
                (response) => {
                    var rows = response.result.values;
                    if (rows.length > 0) {
                        state.sheetData.raw = rows;
                        state.sheetData.nice = formatData(rows)
                        state.sheetData.results = 'success - data found'
                    } else {
                        state.sheetData.results = 'no data found'
                        console.log("no data found");
                    }
                    resolve();
                }
            )
        })
    }

    const formatData = function (rows) {
        return rows.map((row, i) => {
            return { name: row[0], comment: row[1] }
        }).filter((obj, i) => {
            return i > 0 //getting rid of the field names
        })
    }

    const getLatestRunner = function () {
        console.log('getLatestRunner 5 ...')
        s.gapiLoadedPromise.then(() => {
            getSheetData().then(() => {
                const latestRunner = state.sheetData.nice[state.sheetData.nice.length - 1]
                s.dom.$nameBox.text(latestRunner.name)
                hideBox(s.dom.$spinnerBox)
                showBox(s.dom.$contentBox)
            });
        })
    }

    const hideBox = function($box){
        $box.addClass('d-none')
    }

    const showBox = function($box){
        console.log('show box....')
        console.log($box)
        $box.removeClass('d-none')
    }

    return {
        s,
        state,
        init,
        getSheetData,
        getLatestRunner
    }
})();








    // function listMajors() {
    //     gapi.client.sheets.spreadsheets.values
    //         .get({
    //             spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    //             range: "Class Data!A2:E",
    //         })
    //         .then(
    //             function (response) {
    //                 var range = response.result;
    //                 if (range.values.length > 0) {
    //                     appendPre("Name, Major:");
    //                     for (i = 0; i < range.values.length; i++) {
    //                         var row = range.values[i];
    //                         // Print columns A and E, which correspond to indices 0 and 4.
    //                         appendPre(row[0] + ", " + row[4]);
    //                     }
    //                 } else {
    //                     appendPre("No data found.");
    //                 }
    //             },
    //             function (response) {
    //                 appendPre("Error: " + response.result.error.message);
    //             }
    //         );
    // }