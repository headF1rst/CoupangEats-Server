const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const storeDao = require('./storeDao');

exports.getCategories = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const categoryResult = await storeDao.getCategories(connection);
    connection.release();

    return categoryResult;
};

exports.getStoreInfo = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeInfoResult = await storeDao.getStoreInfo(connection, storeId);
    connection.release();

    return storeInfoResult;
};

exports.getFoodsFromMenu = async function (menuId, storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const FoodsInMenuResult = await storeDao.getFoodsFromMenu(connection, menuId, storeId);
    connection.release();

    return FoodsInMenuResult;
};

exports.getStore = async function (storeName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeName2 = '%' + storeName + '%';
    const FindStore = await storeDao.getStore(connection, storeName2);
    connection.release();

    return FindStore;
};

exports.getStoreReview = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const findReview = await storeDao.getStoreReview(connection, storeId);
    connection.release();

    return findReview;
};

exports.getCheetahDel = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const cheetahResult = await storeDao.getCheetah(connection);
    connection.release();

    return cheetahResult;
};

exports.getStoreSortNew = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const sortStoreByNewResult = await storeDao.getStoreByNew(connection);
    connection.release();

    return sortStoreByNewResult;
};

exports.getReviewSortGood = async function (storeName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const sortReviewByGood = await storeDao.getRiviewByHigh(connection, storeName);
    connection.release();

    return sortReviewByGood;
};

exports.getReviewSortBad = async function (storeName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const sortReviewByBad = await storeDao.getRiviewByLow(connection, storeName);
    connection.release();

    return sortReviewByBad;
};

exports.getStoreByReview = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeByReview = await storeDao.storeByStar(connection);
    connection.release();

    return storeByReview;
};




