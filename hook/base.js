const apiHandle = (uri, params) => {
    return fetch(uri, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
    });
}

export default apiHandle;