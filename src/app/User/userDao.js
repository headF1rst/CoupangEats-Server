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

async function IdCheck(connection, Id) {
  const query = `
  select email
  from User
  where email = ?;
              `;
  const [IdRows] = await connection.query(query, Id);
  return IdRows;
}

async function passwordCheck(connection, selectUserPasswordParams) {
  const query = `
  select password
  from User
  where email = ?;
              `;
  const [passwordRows] = await connection.query(query, selectUserPasswordParams);
  return passwordRows;
}

async function accountCheck(connection, Id) {
  const query = `
  select id
  from User
  where email = ?;
              `;
  const [accountCheckRows] = await connection.query(query, Id);
  return accountCheckRows;
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
};
