const jwtMiddleware = require('../../../config/jwtMiddleware');
const storeProvider = require('../../app/store/storeProvider');
const storeService = require('../../app/store/storeService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

/**
 * API No. 1
 * API Name : 카테고리 조회 API
 * [GET] /app/categories
 */
exports.getCategories = async function (req, res) {
    const categories = await storeProvider.getCategories();
    return res.send(response(baseResponse.SUCCESS, categories));
};

/**
 * API No. 4
 * API Name : 가게별 정보 조회 API
 * [GET] /app/stores/{storeIds}/storeInfos
 */
exports.getStoreInfo = async function (req, res) {
    /**
     * Path Variable: storeId
     */
    const storeId = req.params.storeId;

    const storeInfos = await storeProvider.getStoreInfo(storeId);
    return res.send(response(baseResponse.SUCCESS, storeInfos));
};

/**
 * API No. 5
 * API Name : 매뉴별 음식 조회 API
 * [GET] /app/menus/{menuId}/stores/{storeId}/foods
 */
exports.getFoodsFromMenu = async function (req, res) {
    /**
     * Path Variable: menuId, storeId
     */
    const menuId = req.params.menuId;
    const storeId = req.params.storeId;

    const FoodsInMenu = await storeProvider.getFoodsFromMenu(menuId, storeId);
    return res.send(response(baseResponse.SUCCESS, FoodsInMenu));
};

/**
 * API No. 8
 * API Name : 가게 검색 API
 * [GET] /app/stores
 */
 exports.searchStore = async function (req, res) {
    /**
     * Path Variable: storeName
     */
    const { storeName } = req.query;

    if(!storeName){
        return res.send(response(baseResponse.STORE_NAME_EMPTY));
    }
    else{
        const FindStore = await storeProvider.getStore(storeName);
        return res.send(response(baseResponse.SUCCESS, FindStore));
    }
};

/**
 * API No. 12
 * API Name : 리뷰상세조회 API
 * [GET] /app/stores/ {storeId} /reviews
 */
 exports.getReviews = async function (req, res) {
    /**
     * Path Variable: storeId
     */
    const storeId = req.params.storeId;

    const storeReview = await storeProvider.getStoreReview(storeId);
    return res.send(response(baseResponse.SUCCESS, storeReview));
};

/**
 * API No. 13
 * API Name : 가게리뷰생성 API
 * [POST] /app/stores/reviews
 */
 exports.postReviews = async function (req, res) {
    /**
     * body : { storeId, orderId, reviewImageURL, rating } 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const { storeId, orderId, reviewImageURL, rating } = req.body;
    if(!rating) return res.send(errResponse(baseResponse.RATING_EMPTY)); 
    const addReviews = await storeService.addReviews(userIdFromJWT, storeId, orderId, reviewImageURL, rating);
    
    return res.send(response(baseResponse.SUCCESS, "리뷰가 등록되었습니다."));
};

/**
 * API No. 14
 * API Name : 가게리뷰수정 API
 * [PATCH] /app/stores/reviews/{reviewId}
 */
 exports.patchReviews = async function (req, res) {
    /**
     * Path Variable : reviewId
     * body : { reviewImageURL, rating } 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const reviewId = req.params.reviewId;
    const { reviewImageURL, rating } = req.body;
    
    if(!rating) return res.send(errResponse(baseResponse.RATING_EMPTY)); 
    const changeReviews = await storeService.changeReviews(reviewImageURL, rating, userIdFromJWT, reviewId);
    
    return res.send(response(baseResponse.SUCCESS, "리뷰가 수정되었습니다."));
};

/**
 * API No. 18
 * API Name : 치타배달가게조회 API
 * [GET] /app/store/cheetah
 */
 exports.getCheetahDel = async function (req, res) {
    /**
     * Path Variable: 
     */
    const cheetah = await storeProvider.getCheetahDel();
    return res.send(response(baseResponse.SUCCESS, cheetah));
};

/**
 * API No. 21
 * API Name : 신규매장순 조회 API
 * [GET] /app/store/sort/new
 */
 exports.getStoreByNew = async function (req, res) {
    /**
     * Path Variable: 
     */
    const sortNewStore = await storeProvider.getStoreSortNew();
    return res.send(response(baseResponse.SUCCESS, sortNewStore));
};

/**
 * API No. 22
 * API Name : 리뷰 별점높은순 조회 API
 * [GET] /app/review/sort/highStar
 */
 exports.getHighReviews = async function (req, res) {
    /**
     * body : { storeName } 
     */
    const { storeName } = req.body
    const sortHighReview = await storeProvider.getReviewSortGood(storeName);
    return res.send(response(baseResponse.SUCCESS, sortHighReview));
};

/**
 * API No. 23
 * API Name : 리뷰 별점낮은순 조회 API
 * [GET] /app/review/sort/lowStar
 */
 exports.getLowReviews = async function (req, res) {
    /**
     * body : { storeName } 
     */
    const { storeName } = req.body
    const sortLowReview = await storeProvider.getReviewSortBad(storeName);
    return res.send(response(baseResponse.SUCCESS, sortLowReview));
};

/**
 * API No. 23
 * API Name : 매장평점순조회 API
 * [GET] /app/store/sort/review
 */
 exports.getStoreByStar = async function (req, res) {
    /**
     * 
     */
    const sortByReview = await storeProvider.getStoreByReview();
    return res.send(response(baseResponse.SUCCESS, sortByReview));
};


