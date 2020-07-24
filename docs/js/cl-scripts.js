const googleSheetsModule = (function () {
    const s = {
        sheetId: '1i1C9cPeEW9pKDDV42THQVm2GAE2TX6ReHuiPlTMEDQ8',
        sheetRange: 'ResponsesSheet1!C1:D',
        gapiLoadedPromise: null,
        loading: true,
        dom: {
            $nameBox: $('[data-ui="name-box"]'), //asdf - fix this one
            $contentBox: $('[data-ui="content-box"]'),
            $spinnerBox: $('[data-ui="spinner-box"]'),
            $storyBox: $('[data-ui="story-box"]')
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
        s.gapiLoadedPromise.then(() => {
            getSheetData().then(() => {
                const latestRunner = state.sheetData.nice[state.sheetData.nice.length - 1]
                s.dom.$nameBox.text(latestRunner.name)
                if(isNameTooLong(latestRunner.name)){
                    s.dom.$nameBox.addClass('cl-a-bit-smaller')
                }

                hideBox(s.dom.$spinnerBox)
                
                showBox(s.dom.$contentBox)
            });
        })
    }

    const buildListOfRunners = function () {
        s.gapiLoadedPromise.then(() => {
            getSheetData().then(() => {
                state.sheetData.nice.forEach((runner, i) => {
                    addRunner(runner)
                    if (i < (state.sheetData.nice.length - 1)) {
                        addIcon()
                    }
                })
                hideBox(s.dom.$spinnerBox)
                showBox(s.dom.$storyBox)
                addScrollInListener();
            });
        })
    }

    const addRunner = function (data, i) {
        //asdf - need to make this comment conditional!
        const smallerClass = isNameTooLong(data.name)?'cl-a-bit-smaller':''
        let runnerMarkupString = `
        <div class="cl-wide-row cl-name-row">
            <h2 class="cl-big-runner-name cl-text-shadow ${smallerClass}">${data.name}</h2>`
        if (data.comment && data.comment.length > 0) {
            runnerMarkupString += `<p class="cl-runner-comment invisible cl-scroll-in">"${data.comment}"</p>`
        }
        runnerMarkupString += `</div>`
        const $runnerMarkup = $(runnerMarkupString);

        s.dom.$storyBox.append($runnerMarkup)
    }

    // Check to see if any word in the name is too long, if so
    // we can use this to add a css class to lower the font size
    const isNameTooLong = function(name){
        const maxWordLength = 9
        const nameArr = name.split(' ')
        return !!nameArr.find(word=>{
            return word.length > maxWordLength
        })
    }

    const addScrollInListener = function () {
        var win = $(window);
        var allMods = $(".cl-scroll-in");

        // Already visible modules
        allMods.each(function (i, el) {
            var el = $(el);
            if (el.visible(true)) {
                el.removeClass("invisible");
                el.addClass("slide-in-right");
            }
        });

        // 
        win.scroll(function (event) {
            allMods.each(function (i, el) {
                var el = $(el);
                if (el.visible(true)) {
                    el.removeClass("invisible");

                    el.addClass("slide-in-right");
                }
            });

        });
    }

    const addIcon = function () {
        const $iconMarkup = $(`
            <div class="cl-wide-row cl-icon-row">
                <img class="cl-dotted-line-image" src="svg/dottedlines/v2/line-baton-arrow.svg" alt="">
            </div>`);
        s.dom.$storyBox.append($iconMarkup)
    }

    const hideBox = function ($box) {
        $box.addClass('d-none')
    }

    const showBox = function ($box) {
        $box.removeClass('d-none')
    }

    return {
        s,
        state,
        init,
        getSheetData,
        getLatestRunner,
        buildListOfRunners,
        isNameTooLong
    }
})();