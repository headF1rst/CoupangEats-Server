// 모든 유저 조회
async function getCategories(connection) {
    const query = `
    select id, categoryName, categoryImageURL
    from Category;
                  `;
    const [categoryRows] = await connection.query(query);
    return categoryRows;
}

module.exports = {
    getCategories,
};

// 가게별 정보 조회
async function getStoreInfo(connection, storeId) {
    const query = `
    select id as storeId, storeName, phoneNumber, storeAddress, storeInfo, foodInfo, concat(openTime, " ~ ", closeTime) as '영업시간'
    from Store
    where id = ?;
                  `;
    const [storeInfoRows] = await connection.query(query, storeId);
    return storeInfoRows;
}

module.exports = {
    getStoreInfo,
};

// 매뉴별 음식 조회
async function getFoodsFromMenu(connection, menuId, storeId) {
    const query = `
    select m.id as menuId, menuName, foodName, concat(price,'원') as price, thumbnailImageURL
    from Menu m
        left join Food f on m.id = f.menuId
    where m.id = ? 
    and f.storeId = ?;
                  `;
    const [foodsRows] = await connection.query(query, [menuId, storeId]);
    return foodsRows;
}

module.exports = {
    getFoodsFromMenu,
};
