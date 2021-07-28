// CUD in Service
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

// 기본 배송지 수정 (추가하면서)
exports.changeDefault = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const changeDefault = await userDao.changeDefault(connection, userIdFromJWT);
    
        connection.release();
    } catch (err) {
        logger.error(`App - changeDefault Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 배송지 주소 추가
exports.postAddress = async function (userIdFromJWT, addressName) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const addressAdd = await userDao.addAddress(connection, userIdFromJWT, addressName);

        connection.release();
    } catch (err) {
        logger.error(`App - addAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 기본 배송지 수정 (디폴트 배송지 해제)
exports.uncheckAddress = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const checkAddress = await userDao.uncheckDefaultAddress(connection, userIdFromJWT);

        connection.release();
    } catch (err) {
        logger.error(`App - uncheckAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 기본 배송지 수정 (디폴트 배송지로 설정)
exports.checkAddress = async function (userIdFromJWT, addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const checkAddress = await userDao.checkDefaultAddress(connection, userIdFromJWT, addressId);

        connection.release();
    } catch (err) {
        logger.error(`App - checkAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 카트 상품 삭제
exports.deleteCartById = async function (userIdFromJWT, cartId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const rmCart = await userDao.rmCartById(connection, userIdFromJWT, cartId);

        connection.release();
    } catch (err) {
        logger.error(`App - checkAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 즐겨찾기 항목 추가
exports.addFav = async function (userIdFromJWT, storeId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const addFavorite = await userDao.postFav(connection, userIdFromJWT, storeId);

        connection.release();
    } catch (err) {
        logger.error(`App - Post Favorite Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 즐겨찾기 항목 삭제 
exports.patchFav = async function (userIdFromJWT, favoriteId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const addFavorite = await userDao.patchFav(connection, userIdFromJWT, favoriteId);

        connection.release();
    } catch (err) {
        logger.error(`App - Patch Favorite Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 회원가입 
exports.createUser = async function (email, password, name,  phoneNumber, location, birth, sex) {
    try {
        // 비밀번호 암호화
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

        const insertUserInfoParams = [email, hashedPassword, name, phoneNumber, birth, sex];
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            connection.beginTransaction(); // 트랜잭션 적용 시작
            const a = await userDao.insertUserInfo(connection, insertUserInfoParams);
            const b = await userDao.insertDeliveryLocation(
                connection,
                a[0].insertId,
                location
            );
            await connection.commit(); // 커밋
            connection.release(); // conn 회수
            console.log(`추가된 회원 : ${a[0].insertId}`);
            connection.release();
            const result = {
                userId: a[0].insertId,
            };
            return response(baseResponse.SUCCESS, result);
        } catch (err) {
            await connection.rollback(); // 롤백
            connection.release(); // conn 회수
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 회원정보 수정
exports.editUser = async function (phoneNumber, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn); // DB연결 
        const editUserInfo = await userDao.editUsers(connection, phoneNumber, userIdFromJWT);

        connection.release();
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
