const engine = require('./engine');

const handlers = {
    '404': error => {
        return new Response("404 Not Found\n", { status: 404, statusText: "Not Found" });
    },
    '': req => {
        return new Response(Bun.file('views/index.html'));
    }
}



Bun.serve({
    async fetch(req) { // Request handler function to dish out requests
        const url = new URL(req.url);
        const pathname = url.pathname.substring(1);
        
        let handler = handlers[pathname] || Bun.file('public/' + pathname); // Try to find a handler for the requested path, either predifined or by the filename
        if (typeof handler === 'function') 
            return handler(req);
        const exists = await handler.exists();
        if (exists)
            return new Response(handler);
        return handlers['404']();
    },
    port: process.env.PORT || 3000
})