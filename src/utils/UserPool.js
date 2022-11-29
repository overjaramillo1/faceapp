import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData={
   UserPoolId: "us-east-1_MQwendKCy",
   ClientId: "7fh5usiukn07fht43mv3hp35o0"
}

export default new CognitoUserPool(poolData);