// 유저 카트 조회
async function getCart(connection, userId, userId) {
  const query = `
  select z.id as addressId, address, o.id as storeId, storeName
  from User u
           left join (select address, id, userId
                      from Address a
                      where defaultStatus = 1) as z on u.id = z.userId
           left join (select id, foodId, userId
                      from Basket
                      where userId = ?
                        and status = 1) as x on u.id = x.userId
           left join (select id, storeId
                      from Food) as k on x.foodId = k.id
           left join (select id, storeName
                      from Store) as o on k.storeId = o.id
  where u.id = ?
  group by storeId
              `;
  const [cartRows] = await connection.query(query, [userId, userId]);
  return cartRows;
}

async function getFoodInfo(connection, userId) {
  const query = `
  select b.id, foodName, price * foodCount as totalPrice, foodCount, foodNote
  from Basket b
           left join Food f on b.foodId = f.id
  where b.status = 1
    and userId = ?;
            `;
  const [foodRows] = await connection.query(query, userId);
  return foodRows;
}

async function getPrice(connection, userId) {
  const query = `
  select sum(price * b.foodCount) as totalPrice
from Basket b
       left join Food f on b.foodId = f.id
where userId = ?;
          `;
  const [priceRows] = await connection.query(query, userId);
  return priceRows;
}

// 모든 배송지 조회
async function getAddress(connection, userId) {
  const query = `
select userId, id as addressId, address
from Address
where userId = ?
              `;
  const [addressRows] = await connection.query(query, userId);
  return addressRows;
}

// 배송지 주소 삭제
async function deleteAddress(connection, userIdFromJWT, addressId) {
  const query = `
  Update Address
  set status = 'Deleted'
  where userId = ? and id = ?;
              `;
  const [addressRows] = await connection.query(query, [userIdFromJWT, addressId]);
  return addressRows;
}

// 유요한 이메일 아이디인지 확인
async function IdCheck(connection, Id) {
  const query = `
  select email
  from User
  where email = ?;
              `;
  const [IdRows] = await connection.query(query, Id);
  return IdRows;
}

// DB에 존재하는 비밀번호인지 확인
async function passwordCheck(connection, selectUserPasswordParams) {
  const query = `
  select password
  from User
  where email = ?;
              `;
  const [passwordRows] = await connection.query(query, selectUserPasswordParams);
  return passwordRows;
}

// 유저의 고유 Id 추출
async function accountCheck(connection, Id) {
  const query = `
  select id
  from User
  where email = ?;
              `;
  const [accountCheckRows] = await connection.query(query, Id);
  return accountCheckRows;
}

// 기본 배송지 설정 (새로운 주소 추가시)
async function changeDefault(connection, userIdFromJWT) {
  const query = `
  Update Address
  set defaultStatus = 0
  where defaultStatus = 1 and userId = ?
              `;
  const [changeRows] = await connection.query(query, userIdFromJWT);
  return changeRows;
}

// 배송지 주소 추가
async function addAddress(connection, userIdFromJWT, addressName) {
  const query = `
  insert into Address (userId, address)
  values (?, ?)
              `;
  const [checkRows] = await connection.query(query, [userIdFromJWT, addressName]);
  return checkRows;
}

// 기본 배송지 설정 (디폴트 배송지 해제)
async function uncheckDefaultAddress(connection, userIdFromJWT) {
  const query = `
  Update Address
  set defaultStatus = 0
  where defaultStatus = 1 and userId = ?
  `;
  const [uncheckDefaultRows] = await connection.query(query, userIdFromJWT);
  return uncheckDefaultRows;
}

// 기본 배송지 설정 (디폴트로 설정)
async function checkDefaultAddress(connection, userIdFromJWT, addressId) {
  const query = `
  Update Address
  set defaultStatus = 1
  where id = ?
  `;
  const [checkDefaultRows] = await connection.query(query, [userIdFromJWT, addressId]);
  return checkDefaultRows;
}

// 기본 배송지 설정 (디폴트로 설정)
async function rmCartById(connection, userIdFromJWT, cartId) {
  const query = `
  Update Basket
  set status = 0
  where status = 1 and userId = ? and id = ?
  `;
  const [deletedCartRows] = await connection.query(query, [userIdFromJWT, cartId]);
  return deletedCartRows;
}

// 즐겨찾기 목록 조회
async function getFav(connection, userIdFromJWT) {
  const query = `
  select s.id, storeName, reviewImageURL, star, starCount, cheetahDelivery
  from Store s
          left join (select storeId,
                            reviewImageURL,
                            round(sum(rating) / count(storeId), 1) as 'star',
                            count(storeId) as 'starCount'
          from Review) as r on s.id = r.storeId
          inner join (select storeId, id, status
                      from Favorite group by storeId) as f on f.storeId = s.id
                      where f.status = 'Active';
  `;
  const [favRows] = await connection.query(query, userIdFromJWT);
  return favRows;
}

// 즐겨찾기 항목 추가
async function postFav(connection, userIdFromJWT, storeId) {
  const query = `
  insert into Favorite (userId, storeId)
  values (?, ?)
  `;
  const [favRows] = await connection.query(query, [userIdFromJWT, storeId]);
  return favRows;
}

// 즐겨찾기 항목 삭제
async function patchFav(connection, userIdFromJWT, favoriteId) {
  const query = `
  Update Favorite
  set status = 'Deleted'
  where userId = ? and id = ?;
  `;
  const [favRows] = await connection.query(query, [userIdFromJWT, favoriteId]);
  return favRows;
}

// 즐겨찾기 최근 추가순 조회
async function getFavSortByRec(connection, userIdFromJWT) {
  const query = `
  select s.id, storeName, reviewImageURL, star, starCount, cheetahDelivery, f.updatedAt
  from Store s
          left join (select storeId,
                            reviewImageURL,
                            round(sum(rating) / count(storeId), 1) as 'star',
                            count(storeId) as 'starCount'
          from Review) as r on s.id = r.storeId
          inner join (select storeId, id, updatedAt, status
                      from Favorite group by storeId) as f on f.storeId = s.id
  where f.status = 'Active'
  order by DATE(f.updatedAt) DESC;
  `;
  const [favRows] = await connection.query(query, userIdFromJWT);
  return favRows;
}

// 신규회원생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
    insert into User(email, password, name, phoneNumber, birth, sex)
    values (?, ?, ?, ?, ?, ?);
`;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
  return insertUserInfoRow;
}

async function insertDeliveryLocation(connection, userId, location) {
  const insertDeliveryLocationQuery = `
  insert into Address(userId, address)
  values (?, ?);
`;
  const insertDeliveryLocationRow = await connection.query(insertDeliveryLocationQuery, [userId, location]);
}

// 회원정보 수정
async function editUsers(connection, phoneNumber, userIdFromJWT) {
  const query = `
  Update User
  set phoneNumber = ?
  where id = ?;
  `;
  const [favRows] = await connection.query(query, [phoneNumber, userIdFromJWT]);
  return favRows;
}

module.exports = {
  getCart,
  getFoodInfo,
  getPrice,
  getAddress,
  deleteAddress,
  IdCheck,
  passwordCheck,
  accountCheck,
  changeDefault,
  addAddress,
  uncheckDefaultAddress,
  checkDefaultAddress,
  rmCartById,
  getFav,
  postFav,
  patchFav,
  getFavSortByRec,
  insertUserInfo,
  insertDeliveryLocation,
  editUsers
};
