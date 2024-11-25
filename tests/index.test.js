const axios = require("axios");
function sum(a, b) {
  return a + b;
}

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User is able to sign up only once", async () => {
    const username = "kirat" + Math.random();
    const password = "123456";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    const updateResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(400);
  });
  test("Signup request fails if the username is empty", async () => {
    const username = `Kirat-${Math.random()}`;
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });

    expect(response.statusCode).toBe(400);
  });
  test("Signin succeeds if the username & password are correct", async () => {
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });
  test("Signin fails if the username & password are incorrect", async () => {
    const username = `Kirat-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password,
    });

    expect(response.statusCode).toBe(403);
  });
});
describe("User metadata endpoints", () => {
  let token = "";
  let avatarId = "" ;
  beforeAll(async () => {
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSDGn9CW1siMHWHhC4zC2LvdejDrgCK18y6ivogNOyAmLQddGq9eMDo6CrLHuUunKd_gw&usqp=CAU",
      name: "Tinny",
    });

    avatarId = avatarResponse.data.avatarId; 
  });
  test("User can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: "12312345",
    }, {
        headers: {
            "authorization" : `Bearer ${token}`
        }
    });
    expect(response.statusCode).toBe(400);
  });
  test("User can update their metadata with a correct avatar id", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
        avatarId 
    }, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    expect(response.statusCode).toBe(200);
  });
  test("User is not able to update their metadata if the auth header is not present", async() => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
        avatarId 
    }, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    expect(response.statusCode).toBe(403);
  });
});
describe("User avatar information", () => {
    let avatarId;
    let token;
    beforeAll(async () => {
        const username = `kirat-${Math.random()}`;
        const password = "123456";
    
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username,
          password,
          type: "admin",
        });
    
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
          username,
          password,
        });
    
        token = response.data.token;
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSDGn9CW1siMHWHhC4zC2LvdejDrgCK18y6ivogNOyAmLQddGq9eMDo6CrLHuUunKd_gw&usqp=CAU",
          name: "Tinny",
        });
    
        avatarId = avatarResponse.data.avatarId; 
      });
    
})
