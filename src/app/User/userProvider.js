const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const userDao = require('./userDao');

// 카트 조회(나머지 정보)
exports.getCart = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartResult = await userDao.getCart(connection, userId, userId);
    connection.release();

    return cartResult;
};

// 카트 조회(상품 정보)
exports.getFoodInfo = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const foodsResult = await userDao.getFoodInfo(connection, userId);
    connection.release();

    return foodsResult;
};

// 카트 조회(가격 조회)
exports.getPrice = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const priceResult = await userDao.getPrice(connection, userId);
    connection.release();

    return priceResult;
};

// 배송지 조회
exports.getAddress = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const addressResult = await userDao.getAddress(connection, userId);
    connection.release();

    return addressResult;
};

// 아이디 여부 확인
exports.IdCheck = async function (Id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkedIdResult = await userDao.IdCheck(connection, Id);
    connection.release();

    return checkedIdResult;
};

// 비밀번호 확인
exports.passwordCheck = async function (selectUserPasswordParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkedPasswordResult = await userDao.passwordCheck(connection, selectUserPasswordParams);
    connection.release();

    return checkedPasswordResult;
};

// 계정 확인
exports.accountCheck = async function (Id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const accountCheckResult = await userDao.accountCheck(connection, Id);
    connection.release();

    return accountCheckResult;
};

// 즐겨찾기 목록 조회
exports.searchFav = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const getFavResult = await userDao.getFav(connection);
    connection.release();

    return getFavResult;
};

// 즐겨찾기 최근 추가 순 조회
exports.favSortByRec = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const getFavSortedResult = await userDao.getFavSortByRec(connection);
    connection.release();

    return getFavSortedResult;
};

