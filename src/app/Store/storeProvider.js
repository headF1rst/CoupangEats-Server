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