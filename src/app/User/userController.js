const jwtMiddleware = require('../../../config/jwtMiddleware');
const userProvider = require('../../app/User/userProvider');
const userService = require('../../app/User/userService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

/**
 * API No. 2
 * API Name : 카트 조회 API
 * [GET] /app/users/{userId}/cart
 */
exports.getCart = async function (req, res) {
    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const cartInfo = await userProvider.getCart(userId);
    const foodInfo = await userProvider.getFoodInfo(userId);
    const price = await userProvider.getPrice(userId);
    const result = {
        cartInfo: cartInfo[0],
        foods: foodInfo,
        price: price[0],
    };
    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 3
 * API Name : 배송지 조회 API
 * [GET] /app/users/{userId}/address
 */
exports.getAddress = async function (req, res) {
    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const addressInfo = await userProvider.getAddress(userId);
    return res.send(response(baseResponse.SUCCESS, addressInfo));
};

/**
 * API No. 4
 * API Name : 배송지 삭제 API
 * [PATCH] /app/users/address/{addressId}/delete
 */
 exports.deleteAddress = async function (req, res) {
    /**
     * Path Variable: addressId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const addressId = req.params.addressId;

    if (!addressId) return res.send(errResponse(baseResponse.ADDRESS_ADDRESSID_EMPTY));

    const deleteAddressResult = await userService.addressDelete(userIdFromJWT, addressId);
    return res.send(response(baseResponse.SUCCESS, "삭제되었습니다."));
};

/**
 * API No. 6
 * API Name : 로그인 API
 * [POST] /app/user/login
 */
 exports.login = async function (req, res) {
    /**
     * body : {id, password}
     */
    const {Id, password} = req.body;
    if (!Id) return res.send(errResponse(baseResponse.SIGNIN_ID_ERROR_EMPTY));
    if (!password) return res.send(errResponse(baseResponse.SIGNIN_PWD_ERROR_EMPTY));

    const signInResponse = await userService.postSignIn(Id, password);
    return res.send(signInResponse);
};
