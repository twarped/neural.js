

/** 
 * gets The toebrain going and returns the response and process id
 * @param {ArrayBuffer} data Has to be an array buffer, because I wan't it to be binary data. 1's and 0's
 * @returns {Promise<Array>} Promise of the response and process id
 */
function go(data = new ArrayBuffer(0)) {
    return new Promise((resolve, reject) => {
        console.log(data);
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