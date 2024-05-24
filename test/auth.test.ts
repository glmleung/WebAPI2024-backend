import app from "../app";
import request from "supertest";
import { sequelize } from "../database";

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
    const res = await request(app.callback())
      .post("/auth/register")
      .send({ username: "admin", password: "admin", charityCode: "admin" });
    expect(res.body?.token).toBeTruthy();

    const res2 = await request(app.callback())
      .post("/auth/login")
      .send({ username: "admin", password: "admin" });
    expect(res2.body?.token).toBeTruthy();

    const token = res2.body.token;

    const res3 = await request(app.callback())
      .get("/auth/me")
      .auth(token, { type: "bearer" });

    expect(res3.body.role).toBe("admin");
  });
  it("create charities as admin", async () => {
    const res = await request(app.callback())
      .post("/auth/register")
      .send({ username: "admin", password: "admin", charityCode: "admin" });
    expect(res.body?.token).toBeTruthy();

    const token = res.body.token;

    const charityData = { name: "test1", codes: ["test1"] };

    const res3 = await request(app.callback())
      .get("/auth/me")
      .auth(token, { type: "bearer" });
    expect(res3.body.role).toBe("admin");

    const res4 = await request(app.callback())
      .post("/charities")
      .send(charityData);
    expect(res4.status).toBe(401);
    const res5 = await request(app.callback())
      .post("/charities")
      .send({ name: "test1", codes: ["test1"] })
      .auth(token, { type: "bearer" });
    expect(res5.body).toMatchObject(charityData);
  });

  it("login as worker", async () => {
    const adminReg = await request(app.callback())
      .post("/auth/register")
      .send({ username: "admin", password: "admin", charityCode: "admin" });
    expect(adminReg.body?.token).toBeTruthy();
    const token = adminReg.body?.token;
    const charityData = { name: "test1", codes: ["test1"] };
    const createCharity = await request(app.callback())
      .post("/charities")
      .send(charityData)
      .auth(token, { type: "bearer" });
    expect(createCharity.body).toMatchObject(charityData);
    expect(createCharity.body.id).toBeTruthy();
    const charityId = createCharity.body.id;

    const workerReg = await request(app.callback())
      .post("/auth/register")
      .send({
        username: "worker1",
        password: "worker1",
        charityCode: charityData.codes[0],
      });

    const workerToken = workerReg.body?.token;
    expect(workerToken).toBeTruthy();

    const workerMe = await request(app.callback())
      .get("/auth/me")
      .auth(workerToken, { type: "bearer" });
    expect(workerMe.body.role).toBe("worker");
    expect(workerMe.body.charityId).toBe(charityId);
  });
});
