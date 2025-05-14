import { test, expect, request, APIRequestContext } from "@playwright/test";

test.describe('API Reqres', () => {
    let api: APIRequestContext;

    test.beforeAll(async () =>{
        api = await request.newContext({
            baseURL: 'https://reqres.in',
            timeout: 5000,
            extraHTTPHeaders: {
                'x-api-key': 'reqres-free-v1',
            }
        })
    })

    test("Listar usuários e validar dados", async () => {
        const response = await api.get("/api/users?page=2");
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        body.data.forEach((user: any) => {
            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("first_name");
            expect(user).toHaveProperty("last_name");
            expect(user).toHaveProperty("email");
        });
    })

    test("Criar e atualizar um usuário", async () => {
        const time = Date.now();
        const response = await api.post("/api/users", {
            data:{
                email: "niuco@test.com",
                first_name: "niuco",
                last_name: "test"
            }
        });
        const finishTime = Date.now();
        expect(finishTime - time).toBeLessThan(10000);
        expect(response.status()).toBe(201);
        const response_2 = await api.put("/api/users/2", {
            data:{
                email: "niuco@test.com",
                first_name: "niuco",
                last_name: "test"
            }
        })
        expect(response_2.ok()).toBeTruthy();
        const finishTime_2 = Date.now();
        expect(finishTime_2 - time).toBeLessThan(10000);
    });

    test("Manipulação de falhas na API", async () => {
        try {
            const response = await api.get("/api/users/999");
            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(404);
        } catch (error) {
            test.fail();
        }
    });
})