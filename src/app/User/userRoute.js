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
};