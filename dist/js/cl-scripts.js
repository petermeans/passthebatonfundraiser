//i'm just doing the revealing module pattern here to keep it simple and scoped

const googleSheetsModule = (function(){
    const init = function(){
        console.log('lets get this party started!')
    }

    return {
        init
    }
})();