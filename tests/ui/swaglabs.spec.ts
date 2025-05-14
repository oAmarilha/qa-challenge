import { test, expect, Locator} from "@playwright/test";

test.describe("Swag Labs", () => {

    test("Login no sistema", async ({page}, testInfo) => {
        await page.goto("https://www.saucedemo.com");
        expect(page).toHaveTitle("Swag Labs");

        const username:Locator = page.locator("#user-name");
        const password:Locator = page.locator("#password");
        const loginButton:Locator = page.locator("#login-button");

        await username.fill("standard_user");
        await password.fill("secret_sauce");
        await loginButton.click();
        await expect(page.getByText("Products")).toBeVisible();
        testInfo.attachments.push({
            name: "login-screenshot-success",
            body: await page.screenshot(),
            contentType: "image/png"
        });
        await page.locator("#react-burger-menu-btn").click();
        await page.locator("#logout_sidebar_link").click();
        await expect(username).toBeVisible();
        await username.fill("error_user");
        await password.fill("error_pw");
        await loginButton.click();
        await expect(page.locator(".error-message-container")).toBeVisible();
        testInfo.attachments.push({
            name: "login-screenshot-fail",
            body: await page.screenshot(),
            contentType: "image/png"
        })
    })

    test("Adicionar e remover produtos ao carrinho", async ({page}, testInfo) => {
        await page.goto("https://www.saucedemo.com");
        expect(page).toHaveTitle("Swag Labs");

        const username:Locator = page.locator("#user-name");
        const password:Locator = page.locator("#password");
        const loginButton:Locator = page.locator("#login-button");

        await username.fill("standard_user");
        await password.fill("secret_sauce");
        await loginButton.click();
        await expect(page.getByText("Products")).toBeVisible();
        testInfo.attachments.push({
            name: "login-screenshot-success",
            body: await page.screenshot(),
            contentType: "image/png"
        });

        const products:Locator[] = await page.locator(".btn_inventory").all();
        if(products.length > 0){
            for (let i=0; i < 3; i++){
                await products[i].scrollIntoViewIfNeeded();
                await products[i].click();
            }
        }
        else{
            console.log("Nenhum produto encontrado");
            return;
        }
        const cart = page.locator("#shopping_cart_container");
        expect(cart).toBeVisible();
        testInfo.attachments.push({
            name: "cart-screenshot-success",
            body: await page.screenshot(),
            contentType: "image/png"
        });
        await expect(cart).toHaveText("3");
        await cart.click();
        await expect(page.getByText("Your Cart")).toBeVisible();
        testInfo.attachments.push({
            name: "cart-screenshot-success",
            body: await page.screenshot(),
            contentType: "image/png"
        });
        const cartItems:Locator[] = await page.locator(".cart_button").all();
        if(cartItems.length > 0){
            for (let i=0; i < 2; i++){
                await cartItems[i].scrollIntoViewIfNeeded();
                await cartItems[i].click();
                testInfo.attachments.push({
                    name: `product-${i+1}-removed`,
                    body: await page.screenshot(),
                    contentType: "image/png"
                });
                await expect(cart).toHaveText(`${3 - (i + 1)}`);
            }
        }
        testInfo.attachments.push({
            name: "cart-screenshot-remove-success",
            body: await page.screenshot(),
            contentType: "image/png"
        });
    })

    test("Simulação de erro na finalização da compra", async ({page}, testInfo) => {
        await page.goto("https://www.saucedemo.com");
        expect(page).toHaveTitle("Swag Labs");

        const username:Locator = page.locator("#user-name");
        const password:Locator = page.locator("#password");
        const loginButton:Locator = page.locator("#login-button");

        await username.fill("standard_user");
        await password.fill("secret_sauce");
        await loginButton.click();
        await expect(page.getByText("Products")).toBeVisible();
        await page.locator(".btn_inventory").first().click();
        await page.locator("#shopping_cart_container").click();
        await expect(page.getByText("Your Cart")).toBeVisible();
        await page.locator("#checkout").click();
        testInfo.attachments.push({
            name: "checkout-screenshot-page",
            body: await page.screenshot(),
            contentType: "image/png"
        });
        const fieldsRequired:Locator[] = await page.locator(".form_input").all();
        if (fieldsRequired.length > 0 ){
            for (let i = 0; i <= fieldsRequired.length; i++){
                await page.locator("#continue").click();
                if (i === 3){
                    await expect(page.getByText("Checkout: Overview")).toBeVisible();
                    testInfo.attachments.push({
                        name: "checkout-screenshot-success",
                        body: await page.screenshot(),
                        contentType: "image/png"
                    });
                }
                else{
                    await expect(page.locator(".error-message-container")).toBeVisible();
                    testInfo.attachments.push({
                        name: `checkout-screenshot-error-${i}`,
                        body: await page.screenshot(),
                        contentType: "image/png"
                    });
                    await fieldsRequired[i].fill(`user_info_${i}`);
                }
            }
            await page.locator("#finish").click();
            await expect(page.getByText("Checkout: Complete!")).toBeVisible();
            testInfo.attachments.push({
                name: "success-purchase-screenshot-success",
                body: await page.screenshot(),
                contentType: "image/png"
            });
        }
    })
})