module.exports = function (app) {
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 카테고리 조회 API
    app.get('/app/categories', store.getCategories);

    // 4. 가게별 정보 조회 API
    app.get('/app/stores/:storeIds/storeInfos', store.getStoreInfo);

    // 5. 매뉴별 음식 조회 API
    app.get('/app/menus/:menuId/stores/:storeId/foods', store.getFoodsFromMenu);
};