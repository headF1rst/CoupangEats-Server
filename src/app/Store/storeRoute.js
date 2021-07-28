module.exports = function (app) {
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 카테고리 조회 API
    app.get('/app/categories', store.getCategories);

    // 4. 가게별 정보 조회 API
    app.get('/app/stores/:storeIds/storeInfos', store.getStoreInfo);

    // 5. 매뉴별 음식 조회 API
    app.get('/app/menus/:menuId/stores/:storeId/foods', store.getFoodsFromMenu);

    // 8. 가게 검색 API
    app.get('/app/stores', store.searchStore);

    // 12. 가게리뷰상세조회 API
    app.get('/app/stores/:storeId/reviews', store.getReviews);

    // 13. 가게리뷰생성 API
    app.post('/app/stores/reviews', jwtMiddleware, store.postReviews);

    // 14. 가게리뷰수정 API
    app.patch('/app/stores/reviews/:reviewId', jwtMiddleware, store.patchReviews);

    // 18. 치타배달가능가게조회 API
    app.get('/app/store/cheetah', store.getCheetahDel);

    // 21. 신규매장순 조회 API
    app.get('/app/store/sort/new', store.getStoreByNew);

    // 22. 리뷰 별점높은순 조회 API
    app.get('/app/review/sort/highStar', store.getHighReviews);

    // 23. 리뷰 별점낮은순 조회 API
    app.get('/app/review/sort/lowStar', store.getLowReviews);

    // 24. 매장평점순조회 API
    app.get('/app/store/sort/review', store.getStoreByStar);
};