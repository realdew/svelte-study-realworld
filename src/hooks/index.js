import * as cookie from 'cookie';

export async function handle({ event, resolve }) {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const jwt = cookies.jwt && Buffer.from(cookies.jwt, 'base64').toString('utf-8');
    event.locals.user = jwt ? JSON.parse(jwt) : null;
    return await resolve(event);
}


export function getSession({ locals }) {
    return {
        user: locals.user && {
            username: locals.user.username,
            email: locals.user.email,
            image: locals.user.image,
            bio: locals.user.bio
        }
    };
}

/*
 #Hooks

 An optional src/hooks.js (or src/hooks.ts or src/hooks/index.js) file exports four functions,
 all optional, that runs on the server - handle, handleError, getSession, and externalFetch.

 > The location of this file can be configured as 'config.kit.files.hooks'

 ##handle
 This function runs every time SvelteKit receives a request - whether that happens while the app is
 running, or during prerendering - and determines the response.
 It receives an 'event' object representing the request and a function called 'resolve', 
 which invokes SvelteKit's router and generates a response (rendering a page, or invoking an endpoint) accordingly.
 This allows you to modify response headers or bodies, or bypass SvelteKit entirely (for implementing endpoints programmatically, for example).

 src/hooks.js
 '''
 export async function handle({event, resolve }) {
     if ( event.request.url.startsWith('/custom')) {
         return new Response('custom response');
     }

     const response = await resolve(event);
     return response;
 }
 '''
 
 > Requests for static assets - which includes pages that were already prerendered - are not handled by SvelteKit.

 If unimplemented, default `({ event, resolve }) => resolve(event)`. To add custom data to the request, which is passed to endpoints,
 populate the `event.locals` object, as shown below.

 '''
 export async function handle({event, resolve }) {
     event.locals.user = await getUserInformation(event.request.headers.get('cookie'));

     const response = await resolve(event);
     response.headers.set('x-custom-header', 'potato');

     return response;
 }
 '''

 You can add call multiple `handle` functions with the sequence helper function.

 `resolve` also supports a second, optional parameter that gives you more control over how the response will be sent.
 That parameter is an object that can have the following fields:
 * `ssr:boolean` (default true) - if false, renders an empty 'shell' page instead of server-side-rendering
 * `transformPage(opts: { html: string }): string` - applies custom transforms to HTML
 
 '''
 export async function handle({ event, resolve }) {
     const response = await resolve(event, {
        ssr: !event.url.pathname.startsWith('/admin'),
        transformPage: ({ html }) => html.replace('old', 'new')
     });

     return response;
 }
 '''

 > Disabling server-side rendering effectively turns your SvelteKit app into a single-page app or SPA.
 In most situation this is not recommended (see prefix). Consider whether it's truly appropriate to disable it,
 and do so selectively rather than for all request.

 
*/