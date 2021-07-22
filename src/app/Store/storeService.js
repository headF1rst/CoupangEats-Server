const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const storeProvider = require('./storeProvider');
const storeDao = require('./storeDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createstore = async function (email, password, nickname) {
    try {
        // 이메일 중복 확인
        const emailRows = await storeProvider.emailCheck(email);
        if (emailRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

        const insertstoreInfoParams = [email, hashedPassword, nickname];

        const connection = await pool.getConnection(async (conn) => conn);

        const storeIdResult = await storeDao.insertstoreInfo(connection, insertstoreInfoParams);
        console.log(`추가된 회원 : ${storeIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createstore Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};