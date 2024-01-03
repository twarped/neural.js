

/** 
 * gets The toebrain going and returns the response and process id
 * @param {Uint8Array} data Has to be an Uint8Array, because I wan't it to be binary data
 * @returns {Promise<Array>} Promise of the response and process id
 */
function go(data = new Uint8Array(0)) {
    return new Promise((resolve, reject) => {
        console.log(data);
        console.log(String.fromCharCode.apply(null, new Uint8Array(data)));
        resolve(data);
    });
}

/** 
 * Takes the feedback or the fitness of a process and the process id to evaluate the process
 * @param {Number} data Kind of the fitness or whatever. Number between 0 and 1
 */
function giveFeedback(data = new Number(0)) {
    
}

export default {
    go,
    giveFeedback
};