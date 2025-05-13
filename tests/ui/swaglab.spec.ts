import { test, expect, Locator} from "@playwright/test";

test("Login no sistema", async ({page}, testInfo) =>{
    await page.goto("https://www.saucedemo.com");
    await expect(page).toHaveTitle("Swag Labs");
    const username:Locator = page.locator("#user-name");
    const password:Locator = page.locator("#password");
    const loginButton:Locator = page.locator("#login-button");
    
    await username.fill("standard_user");
    await password.fill("secret_sauce");
    await loginButton.click();
    const cart:Locator = page.locator('#shopping_cart_container');
    
    testInfo.attachments.push({
        name: "login-screenshot-success",
        body: await page.screenshot(),
        contentType: "image/png"
    });
    await expect(cart).toBeVisible();
    await page.locator("#react-burger-menu-btn").click();
    await page.locator("#logout_sidebar_link").click();
    await expect(loginButton).toBeVisible();
    await username.fill("wrong_user");
    await password.fill("wrong_password");
    await loginButton.click();
    await expect(page.locator(".error-message-container")).toBeVisible();
    testInfo.attachments.push({
        name: "login-screenshot-fail",
        body: await page.screenshot(),
        contentType: "image/png"
    });
});

test("Adicionar e remover produtos ao carrinho", async ({page}, testInfo) => {
    await page.goto("https://www.saucedemo.com");
    await expect(page).toHaveTitle("Swag Labs");
    const username:Locator = page.locator("#user-name");
    const password:Locator = page.locator("#password");
    const loginButton:Locator = page.locator("#login-button");
    
    await username.fill("standard_user");
    await password.fill("secret_sauce");
    await loginButton.click();
    const cart:Locator = page.locator('#shopping_cart_container');
    await expect(cart).toBeVisible();
    const products:Locator[] = await page.locator(".inventory_item").all();
    for (let i=0; i <3; i++){
        const product = products[i].locator(".btn_inventory");
        await product.scrollIntoViewIfNeeded();
        await product.click();
        await cart.scrollIntoViewIfNeeded();
        await expect(cart).toHaveText(`${i+1}`);
        testInfo.attachments.push({
            name: `product-${i+1}-added`,
            body: await page.screenshot(),
            contentType: "image/png"
        });
    }
    await cart.click();
    expect(page.getByText("Your Cart")).toBeVisible();
    testInfo.attachments.push({
        name: "cart-screenshot-success",
        body: await page.screenshot(),
        contentType: "image/png"
    });
    const cartItems:Locator[] = await page.locator(".cart_item").all();
    for (let i=0; i <2; i++){
        const cartItem = cartItems[i];
        const removeButton = cartItem.locator(".cart_button");
        await removeButton.scrollIntoViewIfNeeded();
        await removeButton.click();
    }
    await expect(cart).toHaveText("1");
    testInfo.attachments.push({
        name: "cart-screenshot-remove-success",
        body: await page.screenshot(),
        contentType: "image/png"
    });
});

test("Simulação de erro na finalização da compra", async ({page}, testInfo) => {
    await page.goto("https://www.saucedemo.com");
    await expect(page).toHaveTitle("Swag Labs");
    const username:Locator = page.locator("#user-name");
    const password:Locator = page.locator("#password");
    const loginButton:Locator = page.locator("#login-button");
    
    await username.fill("standard_user");
    await password.fill("secret_sauce");
    await loginButton.click();
    const cart:Locator = page.locator('#shopping_cart_container');
    await expect(cart).toBeVisible();
    const products:Locator[] = await page.locator(".inventory_item").all();
    await products[0].locator(".btn_inventory").click();
    await page.locator("#shopping_cart_container").click();
    await expect(page.getByText("Your Cart")).toBeVisible();
    await page.locator("#checkout").click();
    const userInfoCheckout:Locator[] = await page.locator(".form_input").all();
    console.log(userInfoCheckout.length);
    for (let i=0; i <= userInfoCheckout.length; i++){
        await page.locator("#continue").click();
        if (i < userInfoCheckout.length) {
            await expect(page.locator(".error-message-container")).toBeVisible();
            testInfo.attachments.push({
                name: "checkout-screenshot-error",
                body: await page.screenshot(),
                contentType: "image/png"
            });
            await userInfoCheckout[i].fill(`user_info_${i}`);
        }
    }
    await expect(page.getByText("Checkout: Overview")).toBeVisible();
    testInfo.attachments.push({
        name: "checkout-screenshot-page",
        body: await page.screenshot(),
        contentType: "image/png"
    });
    const finish = page.locator("#finish");
    await finish.scrollIntoViewIfNeeded();
    await finish.click();
    await expect(page.getByText("Thank you for your order!")).toBeVisible();
    testInfo.attachments.push({
        name: "checkout-screenshot-success",
        body: await page.screenshot(),
        contentType: "image/png"
    });
}); 