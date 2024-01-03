import engine from './toebrain';

const handlers = {
    '404': error => {
        return new Response("404 Not Found\n", { status: 404, statusText: "Not Found" });
    },
    '': req => {
        return new Response(Bun.file('views/index.html'));
    },
    'api/go': async (req = new Request()) => {
        const response = await engine.go(await req.arrayBuffer()); // get go's response to the body as an array buffer
        return new Response(response, { headers: { 'Content-Type': 'application/json', 'accept': '*/*' } });
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
            return new Response(handler, {status: 200}); // It exists, return the file

        return handlers['404'](); // Nothing was found, return 404
    },
    port: process.env.PORT || 3000
})