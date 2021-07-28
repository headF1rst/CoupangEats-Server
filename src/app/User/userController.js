const jwtMiddleware = require('../../../config/jwtMiddleware');
const userProvider = require('../../app/User/userProvider');
const userService = require('../../app/User/userService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');
const IdRegExp = /^.*(?=.{6,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 6~16 자 이내 숫자 + 영문


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
 * API No. 7
 * API Name : 로그인 API
 * [POST] /app/users/login
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

/**
 * API No. 9
 * API Name : 배송지 추가
 * [POST] /app/users/address/{addressId}/add
 */
 exports.addAddress = async function (req, res) {
    /**
     * body : { address } 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const { addressName } = req.body;
    if(!addressName) return res.send(errResponse(baseResponse.ADDRESS_NAME_EMPTY));
    const changeDefault = await userService.changeDefault(userIdFromJWT);
    const postAddressResponse = await userService.postAddress(userIdFromJWT, addressName);
    
    return res.send(response(baseResponse.SUCCESS, "배송지가 추가되었습니다."));
};

/**
 * API No. 10
 * API Name : 배송지 선택
 * [PATCH] /app/users/address/{addressId}/checkDefault
 */
 exports.checkDefaultAddress = async function (req, res) {
    /**
     * Path variable : addressId
     */
     const userIdFromJWT = req.verifiedToken.userId;
     const addressId = req.params.addressId;
    
    const uncheckAddressResponse = await userService.uncheckAddress(userIdFromJWT);
    const checkAddressResponse = await userService.checkAddress(userIdFromJWT, addressId);
    return res.send(response(baseResponse.SUCCESS, "기본배송지로 선택되었습니다."));
};

/**
 * API No. 11
 * API Name : 카트 상품 삭제
 * [PATCH] /app/carts/{cartId}
 */
 exports.rmCart = async function (req, res) {
    /**
     * Path variable : cartId
     */
     const userIdFromJWT = req.verifiedToken.userId;
     const cartId = req.params.cartId;
    
    const rmCart = await userService.deleteCartById(userIdFromJWT, cartId);
    return res.send(response(baseResponse.SUCCESS, "카트가 삭제되었습니다.")); // 메뉴가 삭제되었습니다.
};

/**
 * API No. 15
 * API Name : 즐겨찾기 목록 조회 API
 * [GET] /app/users/favorites
 */
 exports.getFavorites = async function (req, res) {
    /**
     * 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const searchFav = await userProvider.searchFav(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, searchFav));
};

/**
 * API No. 16
 * API Name :즐겨찾기 항목 추가 API
 * [POST] /app/users/favorites
 */
 exports.postFavorites = async function (req, res) {
    /**
     * Path variable : storeId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const storeId = req.params.storeId;
    
    const postFavResponse = await userService.addFav(userIdFromJWT, storeId);
    return res.send(response(baseResponse.SUCCESS, "즐겨찾기에 추가되었습니다."));
};

/**
 * API No. 17
 * API Name :즐겨찾기 항목 삭제 API
 * [PATCH] /app/users/favorites/:favoriteId
 */
 exports.patchFavorites = async function (req, res) {
    /**
     * Path variable : favoriteId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const favoriteId = req.params.favoriteId;
    
    const patchFavResponse = await userService.patchFav(userIdFromJWT, favoriteId);
    return res.send(response(baseResponse.SUCCESS, "즐겨찾기에서 삭제되었습니다."));
};

/**
 * API No. 19
 * API Name : 즐겨찾기 최근 추가 순 조회 API
 * [GET] /app/favorites/sort/recentlyAdd
 */
 exports.getFavSortByRecent = async function (req, res) {
    /**
     * Path variable : 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const favSortRec = await userProvider.favSortByRec(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, favSortRec));
};

/**
 * API No. 25
 * API Name :회원정보 수정 API
 * [PATCH] /app/users/:userId
 */
 exports.patchUsers = async function (req, res) {
    /**
     * Path variable : userId
     * body : phoneNumber
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const { phoneNumber } = req.body;

    if(userIdFromJWT != userId ) {
        res.send(errResponse(baseResponse.USER_USERID_NOT_MATCH));
    } else {
        const editUserInfo = await userService.editUser(phoneNumber, userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, "회원정보가 수정되었습니다"));
    }
};

/**
 * API No. 20
 * API Name : 회원가입 API
 * [POST] /app/signup
 */
 exports.postUsers = async function (req, res) {
    /**
     * Body: email, password, name,  phoneNumber, location, birth, sex
     */
    const { email, password, name,  phoneNumber, location, birth, sex } = req.body;
    var num = password.search(/[0-9]/g);
    var eng = password.search(/[a-z]/gi);
    var spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    // 형식 체크 (by 정규표현식)
    // if (password.length < 10) {
    //     return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_LENGTH));
    // } else if (
    //     password.search(/\s/) != -1 ||
    //     (num < 0 && eng < 0) ||
    //     (eng < 0 && spe < 0) ||
    //     (spe < 0 && num < 0)
    // ) {
    //     return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_VAL));
    // } else if (/(\w)\1\1/.test(password)) {
    //     return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_CONTINUOUS));
    // }
    if (!regexEmail.test(email)) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    }
    if (!password) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_EMPTY));
    }
    if (!name) {
        return res.send(response(baseResponse.SIGNUP_NAME_ERROR_EMPTY));
    }
    if (!email) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_EMPTY));
    }
    if (!phoneNumber) {
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_EMPTY));
    }
    if (!location) {
        return res.send(response(baseResponse.SIGNUP_LOCATION_ERROR_EMPTY));
    }

    const signUpResponse = await userService.createUser(
        email,
        password,
        name,
        phoneNumber,
        location,
        birth,
        sex,
    );

    return res.send(signUpResponse);
};

