import * as api from '$lib/api';

export async function get() {
    const { tags } = await api.get('tags');

    return {
		headers: {
			'cache-control': 'public, max-age=300'
		},
		body: {
			tags: tags.filter((tag) => /^[a-z]+$/i.test(tag))
		}
	};
}