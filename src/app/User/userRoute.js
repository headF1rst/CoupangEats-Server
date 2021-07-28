module.exports = function (app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 2. 카트 조회 API
    app.get('/app/users/:userId/cart', user.getCart);

    // 3. 배송지 조회 API
    app.get('/app/users/:userId/address', user.getAddress);

    // 6. 배송지 삭제 API
    app.patch('/app/users/address/:addressId/delete', jwtMiddleware, user.deleteAddress);

    // 7. 로그인 API
    app.post('/app/users/login', user.login);

    // 9. 배송지 추가 API
    app.post('/app/users/address/add', jwtMiddleware, user.addAddress);

    // 10. 배송지 선택 API
    app.patch('/app/user/address/:addressId/checkDefault', jwtMiddleware, user.checkDefaultAddress);

    // 11. 카트 상품 삭제 API
    app.patch('/app/carts/:cartId', jwtMiddleware, user.rmCart);

    // 15. 즐겨찾기 목록조회 API
    app.get('/app/users/favorites', jwtMiddleware, user.getFavorites);

    // 16. 즐겨찾기 추가 API
    app.post('/app/users/:storeId/favorites', jwtMiddleware, user.postFavorites);

    // 17. 즐겨찾기 삭제 API
    app.patch('/app/users/favorites/:favoriteId', jwtMiddleware, user.patchFavorites);

    // 19. 즐겨찾기 최근 추가 순 조회 API
    app.get('/app/favorites/sort/recentlyAdd', jwtMiddleware, user.getFavSortByRecent);

    // 20. 회원가입 API
    app.post('/app/signup', user.postUsers);

    // 25. 회원정보 수정 API
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);
};