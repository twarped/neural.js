import { stdin, stdout } from 'process';
import engine from './toebrain';

const handlers = {
    '404': error => {
        return new Response("404 Not Found\n", { status: 404, statusText: "Not Found" });
    },
    '': req => {
        return new Response(Bun.file('views/index.html'));
    },
    'dec-to-binary': req => {
        return new Response(Bun.file('views/dec-to-binary.html'));
    },
    'api/go':
        /**
         * @param {Response} req the client request
         * @returns {Response} toebrain's response
         */
        async req => {
            const body = (await req.body.getReader().read()).value;
            console.log('body', body);
            /**
             * @constant {{ processId: number, stream: ReadableStream }} Promise of the response and process id
             */
            const data = engine.go(body); // get toebrain's response to the body as a readable stream
            return new Response(data.stream, { 'Content-Type': 'application/octet-stream', 'Transfer-Encoding': 'chunked', headers: { 'process-id': data.processId } });
        }
}

Bun.serve({
    async fetch(req) { // Request handler function to dish out requests
        const url = new URL(req.url);
        const pathname = url.pathname.substring(1);

        let handler = handlers[pathname] || Bun.file('public/' + pathname); // Try to find a handler for the requested path, either predifined or from the public folder
        if (typeof handler === 'function')
            return handler(req, Object.fromEntries(url.searchParams.entries())); // If a handler was found, call it with the request and the search params, then return it

        const exists = await handler.exists(); // Since the handler was not found, we'll check if it exists in the public folder
        if (exists)
            return new Response(handler, { status: 200 }); // It exists, return the file

        return handlers['404'](); // Nothing was found, return 404
    },
    port: process.env.PORT || 3000
})

console.log(`Listening on port ${process.env.PORT || 3000}`);