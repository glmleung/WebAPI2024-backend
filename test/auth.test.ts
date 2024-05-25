import app from "../app";
import request from "supertest";
import { sequelize } from "../database";
const appCallback = app.callback();

describe("tests", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  afterEach(async () => {
    await sequelize.drop();
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it("register and login as admin", async () => {
    const res = await request(appCallback)
      .post("/auth/register")
      .send({ username: "admin", password: "admin", charityCode: "admin" });
    expect(res.body?.token).toBeTruthy();

    const res2 = await request(appCallback)
      .post("/auth/login")
      .send({ username: "admin", password: "admin" });
    expect(res2.body?.token).toBeTruthy();

    const token = res2.body.token;

    const res3 = await request(appCallback)
      .get("/auth/me")
      .auth(token, { type: "bearer" });

    expect(res3.body.role).toBe("admin");
  });
  it("create charities as admin", async () => {
    const res = await request(appCallback)
      .post("/auth/register")
      .send({ username: "admin", password: "admin", charityCode: "admin" });
    expect(res.body?.token).toBeTruthy();

    const token = res.body.token;

    const charityData = { name: "test1", codes: ["test1"] };

    const res3 = await request(appCallback)
      .get("/auth/me")
      .auth(token, { type: "bearer" });
    expect(res3.body.role).toBe("admin");

    const res4 = await request(appCallback)
      .post("/charities")
      .send(charityData);
    expect(res4.status).toBe(401);
    const res5 = await request(appCallback)
      .post("/charities")
      .send({ name: "test1", codes: ["test1"] })
      .auth(token, { type: "bearer" });
    expect(res5.body).toMatchObject(charityData);
  });

  it("register/login as worker", async () => {
    const adminReg = await request(appCallback)
      .post("/auth/register")
      .send({ username: "admin", password: "admin", charityCode: "admin" });
    expect(adminReg.body?.token).toBeTruthy();
    const token = adminReg.body?.token;
    const charityData = { name: "test1", codes: ["test1"] };
    const createCharity = await request(appCallback)
      .post("/charities")
      .send(charityData)
      .auth(token, { type: "bearer" });
    expect(createCharity.body).toMatchObject(charityData);
    expect(createCharity.body.id).toBeTruthy();
    const charityId = createCharity.body.id;

    const workerReg = await request(appCallback)
      .post("/auth/register")
      .send({
        username: "worker1",
        password: "worker1",
        charityCode: charityData.codes[0],
      });

    const workerToken = workerReg.body?.token;
    expect(workerToken).toBeTruthy();

    const workerMe = await request(appCallback)
      .get("/auth/me")
      .auth(workerToken, { type: "bearer" });
    expect(workerMe.body.role).toBe("worker");
    expect(workerMe.body.charityId).toBe(charityId);

    const workerLogin = await request(appCallback)
      .post("/auth/login")
      .send({ username: "worker1", password: "worker1" });
    expect(workerLogin.body?.token).toBeTruthy();

    const workerToken2 = workerLogin.body?.token;
    const workerMe2 = await request(appCallback)
      .get("/auth/me")
      .auth(workerToken2, { type: "bearer" });
    expect(workerMe2.body.role).toBe("worker");
    expect(workerMe2.body.charityId).toBe(charityId);

    const dogData = { name: "dog1", breed: "breed1", age: 1, image: "" };
    const dogCreate = await request(appCallback)
      .post("/dogs")
      .send(dogData)
      .auth(workerToken2, { type: "bearer" });

    expect(dogCreate.body).toMatchObject(dogData);
    expect(dogCreate.body.charityId).toBe(charityId);

    const dogId = dogCreate.body.id;

    const dogsGet = await request(appCallback)
      .get("/dogs")
      .auth(workerToken2, { type: "bearer" });
    expect(dogsGet.body).toHaveLength(1);
    expect(dogsGet.body[0]).toMatchObject(dogData);

    const dogGet = await request(appCallback)
      .get(`/dogs/${dogId}`)
      .auth(workerToken2, { type: "bearer" });
    expect(dogGet.body).toMatchObject(dogData);

    const dogUpdate = await request(appCallback)
      .put(`/dogs/${dogId}`)
      .send({ name: "dog2" })
      .auth(workerToken2, { type: "bearer" });
    expect(dogUpdate.body).toMatchObject({
      ...dogData,
      id: dogId,
      name: "dog2",
    });

    const dogDelete = await request(appCallback)
      .delete(`/dogs/${dogId}`)
      .auth(workerToken2, { type: "bearer" });
    expect(dogDelete.status).toBe(200);
    // already deleted
    const dogDelete2 = await request(appCallback)
      .delete(`/dogs/${dogId}`)
      .auth(workerToken2, { type: "bearer" });
    expect(dogDelete2.status).toBe(404);
    const dogGet2 = await request(appCallback)
      .get(`/dogs/${dogId}`)
      .auth(workerToken2, { type: "bearer" });
    expect(dogGet2.status).toBe(404);

    const dogsGet2 = await request(appCallback)
      .get("/dogs")
      .auth(workerToken2, { type: "bearer" });
    expect(dogsGet2.body).toHaveLength(0);
  });
});
