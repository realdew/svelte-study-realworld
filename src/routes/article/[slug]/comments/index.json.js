import * as api from '$lib/api.js';

export async function get({ params, locals }) {
    const { slug } = params;
    const { comments } = await api.get(
        `articles/${slug}/comments`,
        locals.user && locals.user.token
    );

    return {
        body: comments
    };
}

/*
 기존에 form과 headers를 받을 수 있는 방식이 request를 받아서, request 내에서 formData와 headers를 받는 방식으로 변경됨
 https://github.com/sveltejs/kit/pull/3384
*/
//export async function post({ params, form, headers, locals }) {
export async function post({ params, request, locals }) {
    if ( !locals.user ) {
        return { status: 401 };
    }


    const { slug }  = params;
    //const body = request.body;
    //console.log("BODY: ", body);

    const receivedFormData = await request.formData();
    const body = receivedFormData.get('comment');



    const { comment } = await api.post(
        `articles/${slug}/comments`,
        { comment: {body} },
        locals.user.token
    );

    // for AJAX requests, return the newly created comment
    if ( request.headers && request.headers.accept === 'application/json' ) {
        return {
            status: 201,    // created
            body: comment
        }
    }


    // for traditional (no-JS) form submissions, redirect back to the article page
    console.log(`redirecting to /article/${slug}`);
    return {
        status: 303,    // see other
        headers: {
            location: `article/${slug}`
        }
    };
}