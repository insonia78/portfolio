import request from 'supertest';

const app = require('./../app');

test('Initial request', async () => {
   await request(app).get('/').send()
              .expect(200);
});
test('GetAllUsers request', async () => {
   await request(app).get('/getAllUsers').send()
              .expect(200);
});
test('GetAllUsers sortBy=email&sortDirection=descending&page=2&limit=5 request', async () => {
  await request(app).get('/getAllUsers/?sortBy=email&sortDirection=descending&page=2&limit=5').send()
             .expect(200);
});
test('GetAllUsers sortBy=&sortDirection=descending&page=2&limit=5 request', async () => {
  await request(app).get('/getAllUsers/?sortBy=&sortDirection=descending&page=2&limit=5').send()
             .expect(400);
});
test('GetAllUsers sortBy=emai&sortDirection=descending&page=2&limit=5 request', async () => {
  await request(app).get('/getAllUsers/?sortBy=emai&sortDirection=descending&page=2&limit=5').send()
             .expect(400);
});
test('GetAllUsers sortBy=email&sortDirection=descendin&page=2&limit=5 request', async () => {
  await request(app).get('/getAllUsers/?sortBy=email&sortDirection=descendin&page=2&limit=5').send()
             .expect(400);
});
test('GetAllUsers sortBy=email&sortDirection=descending&page=&limit=5 request', async () => {
  await request(app).get('/getAllUsers/?sortBy=email&sortDirection=descending&page=&limit=5').send()
             .expect(400);
});
test('GetAllUsers sortBy=email&sortDirection=descending&page=2&limit= request', async () => {
  await request(app).get('/getAllUsers/?sortBy=email&sortDirection=descending&page=&limit=').send()
             .expect(400);
});
test('CreateUser request 200', async () => {
    let user = {
      "email": "Test_test80@test.com",
      "name": "test",
      "dateOfBirth": "1965-11-27T18:03:03.256Z",
      "phoneNumber": "1-173-967-0467 x50293",
      "address": {
          "street": "56599 Yost Plains",
          "city": "Lake Justen",
          "state": "Louisiana",
          "zipCode": "02308",
          "country": "Jordan"
      }
    }; 

   await request(app).post('/createUser').send(user)
              .expect(200);
});
test('CreateUser request 400', async () => {
   let user = {
     "email": "Test_test80test.com",
     "name": "test",
     "dateOfBirth": "1965-11-27T18:03:03.256Z",
     "phoneNumber": "1-173-967-0467 x50293",
     "address": {
         "street": "56599 Yost Plains",
         "city": "Lake Justen",
         "state": "Louisiana",
         "zipCode": "02308",
         "country": "Jordan"
     }
   }; 

  await request(app).post('/createUser').send(user)
             .expect(400);
});
test('CreateUser user already exists request 400', async () => {
   let user = {
     "email": "Test_test80@test.com",
     "name": "",
     "dateOfBirth": "1965-11-27T18:03:03.256Z",
     "phoneNumber": "1-173-967-0467 x50293",
     "address": {
         "street": "56599 Yost Plains",
         "city": "Lake Justen",
         "state": "Louisiana",
         "zipCode": "02308",
         "country": "Jordan"
     }
   }; 

  await request(app).post('/createUser').send(user)
             .expect(400);
});
test('updateUser request 200', async () => {
   console.log("updateUser request 200 tested in postman");
   let user = {
     "email": "Test_test80test.com",
     "name": "test1",
     "dateOfBirth": "1965-11-27T18:03:03.256Z",
     "phoneNumber": "1-173-967-0467 x50293",
     "address": {
         "street": "56599 Yost Plains",
         "city": "Lake Justen",
         "state": "Louisiana",
         "zipCode": "02308",
         "country": "Jordan"
     }
   }; 

  await request(app).put('/updateUser/Test_test80test.com').send(user)
             .expect(200);
});
test('updateUser request 400', async () => {
   
   let user = {
     "email": "Test1_test80test.com",
     "name": "test1",
     "dateOfBirth": "1965-11-27T18:03:03.256Z",
     "phoneNumber": "1-173-967-0467 x50293",
     "address": {
         "street": "56599 Yost Plains",
         "city": "Lake Justen",
         "state": "Louisiana",
         "zipCode": "02308",
         "country": "Jordan"
     }
   }; 

  await request(app).put('/updateUser/Test_test80test.com').send(user)
             .expect(400);
});
test('DeleteUser request 200', async () => {
   console.log("DeleteUser request 200 tested in postman");
   let user = {
     "email": "Test_test80test.com",
     "name": "test1",
     "dateOfBirth": "1965-11-27T18:03:03.256Z",
     "phoneNumber": "1-173-967-0467 x50293",
     "address": {
         "street": "56599 Yost Plains",
         "city": "Lake Justen",
         "state": "Louisiana",
         "zipCode": "02308",
         "country": "Jordan"
     }
   }; 

  await request(app).delete('/deleteUser/Test_test80test.com').send(user)
             .expect(200);
});