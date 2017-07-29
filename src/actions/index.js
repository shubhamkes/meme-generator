import { username, password } from './secrets';

export const RECEIVE_MEMES = 'RECEIVE_MEMES';
export const NEW_MEME = 'NEW_MEME';

/**
 * generates new meme
 * @param  {object} meme
 */
function newMeme(meme) {
    return {
        type: NEW_MEME,
        meme
    }
}

/**
 * fetches memes initially
 */
export function fetchMemes() {
    return function (dispatch) {
        fetchMemesJson()
            .then(json => dispatch(receiveMemes(json)));
    }
}

/**
 * api get call
 */
function fetchMemesJson() {
    return fetch('https://api.imgflip.com/get_memes')
        .then(response => response.json());
}

function receiveMemes(json) {
    const { memes } = json.data;
    return {
        type: RECEIVE_MEMES,
        memes
    }
}

function postMemeJson(params) {
    params["username"] = username;
    params["password"] = password;

    const bodyParams = Object.keys(params).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');

    return fetch('https://api.imgflip.com/caption_image', {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams
    }).then(response => response.json());

}

export function createMeme(new_meme_object) {
    return function (dispatch) {
        postMemeJson(new_meme_object)
            .then(json => dispatch(newMeme(json)));
    }
}