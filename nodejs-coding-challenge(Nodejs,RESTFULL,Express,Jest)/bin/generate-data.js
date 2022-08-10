const faker = require('faker');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  users: path.resolve(__dirname, '../data/users.json'),
};

const user = () => ({
  email: faker.internet.email(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  dateOfBirth: faker.date.between(1900, 2020),
  phoneNumber: faker.phone.phoneNumber(),
  address: {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zipCode: faker.address.zipCode(),
    country: faker.address.country(),
  }
});

const generate = () => {
  const data = Array.from(new Array(50)).map(user);
  const json = JSON.stringify(data);

  fs.writeFileSync(CONFIG.users, json);
};

console.log('Generating data...')

generate();

console.log('Finished generating data.')
