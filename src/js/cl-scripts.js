//https://docs.google.com/spreadsheets/d/1bwpJ0jaDZ7vUme9k7SRWc994NmqzLOGdFVcpXtPxPE8/edit?usp=sharing

const googleSheetsModule = (function () {
    const s = {
        sheetId: '12355',
        gapiLoadedPromise:null,
        loading:true
    }

    const init = function () {
        console.log('init - go')
        s.gapiLoadedPromise = waitForGAPI();
        s.gapiLoadedPromise.then(()=>{},()=>{
            console.log('Error: failed to load gapi')
        })
    }

    const waitForGAPI = function (callback){
        return new Promise((resolve,reject)=>{
            let count = 0
            const myInterval = setInterval(()=>{
                if(gapiReady){
                    clearInterval(myInterval)
                    resolve()
                }
                else{
                    count++
                    if(count > 300){
                        clearInterval(myInterval)
                        reject();
                    }
                    //asdf
                }
            },100)
        })
    }

    const getSheetData = function () {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            range: "Class Data!A2:E",
        }).then(
            function(response){
                console.log('got somethin!')
                console.log(response)
            }
        )
    }

    const getLatestRunner = function(){
        console.log('getLatestRunner...')
        s.gapiLoadedPromise.then(()=>{
            getSheetData()
        })
    }


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
    

    return {
        s,
        init,
        getSheetData,
        getLatestRunner
    }
})();




