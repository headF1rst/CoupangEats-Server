// 모든 유저 조회
async function getCategories(connection) {
    const query = `
    select id, categoryName, categoryImageURL
    from Category;
                  `;
    const [categoryRows] = await connection.query(query);
    return categoryRows;
}

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

// 가게 검색
async function getStore(connection, storeName) {
    const query = `
    select storeName
    from Store
    where storeName = ?;
    `;
    const [storeRows] = await connection.query(query, storeName);
    return storeRows;
}

// 가게리뷰상세조회 (추후에 전체 리뷰 평점, 리뷰 갯수 따로 dao 추가해서 만들어야함)
async function getStoreReview(connection, storeId) {
    const query = `
    select s.id as storeId, storeName, reviewImageURL, rating, helped
    from Store s
            left join Review r on r.storeId = s.id
    where s.id = ?;
    `;
    const [reviewRows] = await connection.query(query, storeId);
    return reviewRows;
}

// 가게리뷰생성
async function postReviews(connection, userIdFromJWT, storeId, orderId, reviewImageURL, rating) {
    const query = `
    insert into Review (userId, storeId, orderId, reviewImageURL, rating)
    values (? ,? ,? ,? ,?)
                `;
    const [postReviewRows] = await connection.query(query, [userIdFromJWT, storeId, orderId, reviewImageURL, rating]);
    return postReviewRows;
  }

// 가게리뷰수정
async function patchReviews(connection, reviewImageURL, rating, userIdFromJWT, reviewId) {
    const query = `
    Update Review
    set reviewImageURL = ?, rating = ?
    where userId = ? and id = ?
                `;
    const [patchReviewRows] = await connection.query(query, [reviewImageURL, rating, userIdFromJWT, reviewId]);
    return patchReviewRows;
  }

// 치타배달 가능 가게 추출
async function getCheetah(connection) {
    const query = `
    select s.id, storeName, thumbnailImageURL, star, starCount, cheetahDelivery
    from Store s
            left join (select storeId,
                            reviewImageURL,
                            round(sum(rating) / count(storeId), 1) as 'star',
                            count(storeId) as 'starCount'
            from Review) as r on s.id = r.storeId
            left join Food as f on s.id = f.storeId
    where cheetahDelivery = '치타배달';
                `;
    const [cheetahRows] = await connection.query(query);
    return cheetahRows;
  }

// 신규가게순 정렬
async function getStoreByNew(connection) {
    const query = `
    select s.id, storeName, thumbnailImageURL, star, starCount, cheetahDelivery, s.updatedAt, deliverTime
    from Store s
            left join (select storeId,
                            reviewImageURL,
                            round(sum(rating) / count(storeId), 1) as 'star',
                            count(storeId) as 'starCount'
            from Review) as r on s.id = r.storeId
            left join Food as f on s.id = f.storeId
    order by DATE(s.updatedAt) DESC;
                `;
    const [sortRows] = await connection.query(query);
    return sortRows;
  }

// 별점높은 리뷰순 리뷰정렬
async function getRiviewByHigh(connection, storeName) {
    const query = `
    select userId, storeName, rating, reviewImageURL, helped
    from Review as r left join Store s on s.id = r.storeId
    where r.status = 'Active' and storeName = ?
    order by rating DESC;
                `;
    const [sortRows] = await connection.query(query, storeName);
    return sortRows;
  }

// 별점낮은 리뷰순 리뷰정렬
async function getRiviewByLow(connection, storeName) {
    const query = `
    select userId, storeName, rating, reviewImageURL, helped
    from Review as r left join Store s on s.id = r.storeId
    where r.status = 'Active' and storeName = ?
    order by rating ASC;
                `;
    const [sortRows] = await connection.query(query, storeName);
    return sortRows;
  }

// 별점낮은 리뷰순 리뷰정렬
async function storeByStar(connection) {
    const query = `
    select s.id, storeName, thumbnailImageURL, star, starCount, cheetahDelivery, deliverTime
    from Store s
            left join (select storeId,
                            reviewImageURL,
                            round(sum(rating) / count(storeId), 1) as 'star',
                            count(storeId) as 'starCount'
            from Review) as r on s.id = r.storeId
            left join Food as f on s.id = f.storeId
    order by star DESC;
                `;
    const [storeRows] = await connection.query(query);
    return storeRows;
  }

module.exports = {
    getCategories,
    getStoreInfo,
    getFoodsFromMenu,
    getStore,
    getStoreReview,
    postReviews,
    patchReviews,
    getCheetah,
    getStoreByNew,
    getRiviewByHigh,
    getRiviewByLow,
    storeByStar,
};
