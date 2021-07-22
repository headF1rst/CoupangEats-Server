const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const { logger } = require('../../../config/winston');
const secret_config = require('../../../config/secret');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const { pool } = require("../../../config/database");


// 배송지 주소 삭제
exports.addressDelete = async function (userIdFromJWT, addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const addressDelete = await userDao.deleteAddress(connection, userIdFromJWT, addressId);

        connection.release();
        return addressDelete;

    } catch (err) {
        logger.error(`App - deleteAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 로그인
exports.postSignIn = async function (Id, password) {
    try {
        // 아이디 여부 확인
        const IdRows = await userProvider.IdCheck(Id);
       
        if (IdRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
        // console.log(IdRows[0]);
        const selectId = IdRows[0].email;

        // 비밀번호 확인
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
        console.log(hashedPassword);
        const selectUserPasswordParams = [selectId, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if (passwordRows[0].password != hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(Id);

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: '365d',
                subject: 'userInfo',
            }, // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {
            userId: userInfoRows[0].id,
            jwt: token,
        });
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
