import { test, expect , request, APIRequestContext} from "@playwright/test";

test.describe('API Reqres', () => {
    let api: APIRequestContext;

test.beforeAll(async () => {
    api = await request.newContext({
      baseURL: 'https://reqres.in',
      timeout: 5000,
      extraHTTPHeaders: {
        'x-api-key': ' reqres-free-v1',
      }
    });
  });

  test("Listar usuários e validar dados:", async () => {
    const response = await api.get('/api/users?page=2');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();

    body.data.forEach((user: any) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
    });
  });

  test("Criar e atualizar um usuário:", async () =>{
    const time = Date.now();
    const response = await api.post("/api/users",{
        data: {
            email: "niuco@test.com",
            first_name: "niuco",
            last_name: "test"
        }
    });
    expect(response.ok()).toBeTruthy();
    const finishTime = Date.now();
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.email).toEqual("niuco@test.com");
    expect(body.first_name).toEqual("niuco");
    expect(body.last_name).toEqual("test");
    const responseUpdate = await api.put("/api/users/2", {
      data: {
        first_name: "niuco",
        last_name: "test",
        email: "niuco@test.com"
      }
    });
    expect(responseUpdate.ok()).toBeTruthy();
    const bodyUpdate = await responseUpdate.json();
    expect(bodyUpdate.first_name).toEqual("niuco");
    expect(bodyUpdate.last_name).toEqual("test");
    expect(bodyUpdate.email).toEqual("niuco@test.com");
    expect(finishTime - time).toBeLessThan(5000);
  });

  test("Manipulação de falhas na API:", async () => {
    const response = await api.get("/api/users/999"); // Utilizei o GET, pois o delete está retornando 204 - No Content
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(404);
  });
});