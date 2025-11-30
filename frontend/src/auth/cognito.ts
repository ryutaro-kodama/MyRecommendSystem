import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

// Configuration - These should ideally come from environment variables
export const COGNITO_CONFIG = {
    region: import.meta.env.VITE_AWS_REGION || "us-east-1",
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "",
};

export const cognitoClient = new CognitoIdentityProviderClient({
    region: COGNITO_CONFIG.region,
});
