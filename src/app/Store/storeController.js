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
     * Path Variable: userId
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
