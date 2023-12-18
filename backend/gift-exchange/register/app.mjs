import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

export const lambdaHandler = async (event) => {
  try {
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    const { name, email, wants } = JSON.parse(event.body);
    const TABLE = process.env.TABLE;

    // Validate data
    if (!name || !email || !wants) {
      return {
        statusCode: 400,
      };
    }

    // Validate data length
    if (name.length > 50 || email.length > 50 || wants.length > 200) {
      return {
        statusCode: 400,
      };
    }

    // Prepare data
    const data = {
      name,
      email,
      wants,
      submittedAt: new Date().toISOString(),
    };

    // Insert into DynamoDB
    const client = new DynamoDBClient({ region: "us-east-1" });
    const command = new PutItemCommand({
      TableName: TABLE,
      Item: {
        id: { S: randomUUID() },
        name: { S: name },
        email: { S: email },
        wants: { S: wants },
        submittedAt: { S: data.submittedAt },
      },
    });
    const response = await client.send(command);
    if (response) {
      // Send Discord notification
      const message = `${name} (${email}), se ha registrado para el intercambio de regalos.`;
      const discordResponse = await sendDiscordNotification(
        DISCORD_WEBHOOK_URL,
        message
      );
      if (!discordResponse) {
        return {
          statusCode: 500,
        };
      } else {
        return {
          statusCode: 200,
        };
      }
    } else {
      return {
        statusCode: 500,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
    };
  }
};

// function to send a Discord notification
export async function sendDiscordNotification(webhookURL, message) {
  const response = await fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  });
  return response.status === 204 ? true : false;
}
