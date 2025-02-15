let model = Bun.file('model');

/** 
 * gets The toebrain going and returns the response and process id
 * @param {Uint8Array} res Has to be an Uint8Array, because I want it to be binary data
 * @returns {{ processId: number, stream: ReadableStream }} Promise of the response and process id
*/
function go(body) {
    const data = new Uint8Array(body.length); // Set the response buffer to the actual length of the response
    data.set(body);

    return {
        processId: 1, // Placeholder for the process id
        stream: new ReadableStream({
            async start(controller) {
                const dataView = new DataView(data.buffer);
                const response = await random(4);
                console.log('body', dataView.getUint32());
                console.log('response', new DataView(response.buffer).getUint32());
                console.log(response);
                controller.enqueue(response); // Send the response through the stream
                controller.close(); // Close the stream
            }
        })
    }
}

/** 
 * Takes the feedback or the fitness of a process and the process id to evaluate the process
 * @param {Number} processId The id of the process in question
 * @param {Number} fitness How good the process's response was. Number between 0 and 1
 */
function giveFeedback(processId, fitness) {

}

/**
 * Returns an amount of random bytes taken from /dev/random or /dev/urandom
 * @param {number} bytes Amount of bytes to recieve from /dev/random or /dev/urandom. Defaults to 1
 * @param {boolean} random Whether or not to recieve random bytes from /dev/random. Defaults to false
 * 
 * @returns {Promise<Uint8Array>} Array of random bytes
 */
function random(bytes = 1, random = false) {
    return new Promise(async (resolve, reject) => {

        // Spawn a process of `dd` to get x amount of random bytes from /dev/random or /dev/urandom
        const process = Bun.spawn({
            cmd: ['dd', 'if=/dev/' + (random ? 'random' : 'urandom'), 'bs=' + bytes, 'count=1', 'status=none'],
            stdout: 'pipe',
            stderr: 'pipe'
        });

        const errors = [];
        for await (const chunk of process.stderr) { // Store any errors
            errors.push(chunk);
        }

        if (errors.length > 0) { // Reject any stored errors
            reject(errors);
        }

        let collectedBytes = new Uint8Array(bytes);
        let bytesRead = 0;

        for await (const chunk of process.stdout) {
            const remaining = bytes - bytesRead;
            collectedBytes.set(chunk.slice(0, remaining), bytesRead);
            bytesRead += Math.min(chunk.length, remaining);
            if (bytesRead >= 1) break; // Stop once x bytes are collected
        }

        await process.exited; // Just to make sure that Bun stops looking at stdout

        resolve(collectedBytes); // Resolve the random bytes collected from /dev/(u)random
    });
}

function matrixCreator(matrix) {
    let matrixFile = Bun.file('matrix.bin');
}

export default {
    go,
    giveFeedback
};