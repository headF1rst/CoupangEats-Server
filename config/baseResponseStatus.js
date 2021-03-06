module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2001, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2002, "message": "해당 회원이 존재하지 않습니다." },
    ADDRESS_ADDRESSID_EMPTY : {"isSuccess": false, "code":2003, "message": "addressId를 입력해주세요."},
    SIGNIN_ID_ERROR_EMPTY : {"isSuccess": false, "code":2004, "message": "Id를 입력해주세요."},
    SIGNIN_PWD_ERROR_EMPTY : {"isSuccess": false, "code":2005, "message": "비밀번호를 입력해주세요."},
    STORE_NAME_EMPTY : {"isSuccess": false, "code":2006, "message": "검색어를 입력해주세요."},
    ADDRESS_NAME_EMPTY : {"isSuccess": false, "code":2007, "message": "주소를 입력해주세요."},
    STORE_EMPTY : {"isSuccess": false, "code":2008, "message": "리뷰대상 가게 이름을 입력해 주세요."},
    RATING_EMPTY : {"isSuccess": false, "code":2009, "message": "평점을 입력해 주세요."},
    USER_USERID_NOT_MATCH : {"isSuccess": false, "code":2010, "message": "유저 아이디값을 확인해 주세요."},
    SIGNUP_EMAIL_ERROR_TYPE : {"isSuccess": false, "code":2011, "message": "이메일 형식을 확인해 주세요."},
    SIGNUP_PASSWORD_ERROR_EMPTY : {"isSuccess": false, "code":2012, "message": "비밀번호를 입력해주세요."},
    SIGNUP_NAME_ERROR_EMPTY : {"isSuccess": false, "code":2013, "message": "이름을 입력해주세요."},
    SIGNUP_EMAIL_ERROR_EMPTY : {"isSuccess": false, "code":2014, "message": "이메일을 입력해주세요."},
    SIGNUP_PHONENUMBER_ERROR_EMPTY : {"isSuccess": false, "code":2015, "message": "번호를 입력해주세요."},
    SIGNUP_LOCATION_ERROR_EMPTY : {"isSuccess": false, "code":2016, "message": "주소를 입력해주세요."},
    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
