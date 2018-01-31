/**
 * @file Xρίσημα functions τα οποία χρισημοποιούνται για γενικούς σκοπούς
 */


/**
 *
 * @param params {object} - parameters για να γίνουν url parameters string
 * @returns {string}
 * @desc δέχετε ένα αντικείμενο και το μετατρέπει σε url parameters
 * το χρισημοποιούμε κυρίως στο fetch api
 */
function getParams(params) {
    if (typeof params === 'object') {

        return query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
    }
}

/**
 * @desc βάζει ένα μηδενικό μπροστά σε μονοψήφιο
 * @param n
 * @returns {string}
 */
function pad(n){return n<10 ? '0'+n : n}
/**
 * @desc επιστρέφει την ημερομήνία σήμερα
 * @returns {string}
 */
function dateNow() {
    d = new Date();
    return`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function showPage(name,id) {
    router.push({ name: name, params: { id: id }});
}

