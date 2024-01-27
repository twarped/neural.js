let model = Bun.file('model');
let modelWriter = model.writer();


/** 
 * gets The toebrain going and returns the response and process id
 * @param {Uint8Array} data Has to be an Uint8Array, because I wan't it to be binary data
 * @returns {ReadableStream} Promise of the response and process id
*/
function go(data) {
    return new ReadableStream({ // Tried a PassThrough stream here, it didn't work because of a double-wrapped ReadableStream
        async start(controller) {
            controller.enqueue(data);
            controller.close();
        }
    });
}

/** 
 * Takes the feedback or the fitness of a process and the process id to evaluate the process
 * @param {Number} data Kind of the fitness or whatever. Number between 0 and 1
 */
function giveFeedback(data) {
    
}

export default {
    go,
    giveFeedback
};