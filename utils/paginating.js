export function paginating(page, perPage, items) {
    let returnResult = [];
    for (let i = 0; i < perPage * (page - 1); i++) {
        items.shift();
    }
    for (let i = 0; i < perPage && items.length > 0; i++) {
        returnResult.push(items.shift());
    }
    return returnResult;
}