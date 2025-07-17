const opsdk = require('@1password/sdk');
require('dotenv').config();

(async function main() {
    /**********************************************
     * Step 0: Authenticate with 1Password
     * Ensure you have set the OP_SERVICE_ACCOUNT_TOKEN in your .env file
     * This token should be created in your 1Password account
     * and should have access to the vault and items you want to retrieve.
     * For more information, see:
     * https://support.1password.com/command-line-get-started/#service-account
     **********************************************/
    console.log("Authenticating with 1Password...");
    const opClient = await opsdk.createClient({
        auth: process.env.OP_SERVICE_ACCOUNT_TOKEN,
        integrationName: "My 1Password Integration",
        integrationVersion: "v1.0.0",
    });
    console.log("1Password Client created successfully");


    /**********************************************
     * Step 1: (SIMPLE) Get secrets with Vault and Item IDs
     **********************************************/
    // CHANGE THESE VALUES TO YOUR OWN
    const vaultId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your vault ID
    const itemId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your item ID

    const username = await opClient.secrets.resolve(`op://${vaultId}/${itemId}/username`);
    const password = await opClient.secrets.resolve(`op://${vaultId}/${itemId}/password`);
    console.log("Credentials retrieved successfully");

    console.log("username:", username);
    console.log("password:", password);


    /**********************************************
     * Step 2: Get items with Vault and Item UUIDs
     * This is a more advanced method that allows you to retrieve items
     * like one-time passwords or other complex items.
     **********************************************/
    // CHANGE THESE VALUES TO YOUR OWN
    const vaultUUID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your vault UUID
    const itemUUID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your item UUID

    let retrievedItem = await opClient.items.get(vaultUUID, itemUUID);
    console.log("Item retrieved successfully");

    // console.log(retrievedItem);

    // Get a one-time password code.
    let onetime_password;
    let element = retrievedItem.fields.find((element) => {
        return element.fieldType == opsdk.ItemFieldType.Totp;
    });

    if (!element) {
        console.error("no totp field found on item");
    } else {
        switch (element.details.type) {
            case "Otp": {
                if (element.details.content.code) {
                    onetime_password = element.details.content.code;
                } else {
                    console.error(element.details.content.errorMessage);
                }
            }
            default:
        }
    }

    console.log("username:", retrievedItem.fields.find(f => f.id === "username").value);
    console.log("password:", retrievedItem.fields.find(f => f.id === "password").value);
    console.log("one-time password:", onetime_password);
}())