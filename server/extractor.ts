import crypto from 'node:crypto';
import { FullSwingShareData } from './types.js';

const IDENTITY_POOL_ID = 'us-east-1:d57ce9cf-7c30-4574-9796-6b4f2c259bd1';
const AWS_REGION = 'us-east-1';
const APPSYNC_ENDPOINT = 'https://v4zo4u4aknhy5gas4bklptclle.appsync-api.us-east-1.amazonaws.com/graphql';
const APPSYNC_HOST = 'v4zo4u4aknhy5gas4bklptclle.appsync-api.us-east-1.amazonaws.com';

const GRAPHQL_QUERY = `
query GetLmShareSession($shareUrl: ID!) {
  getLmShareSession(shareUrl: $shareUrl) {
    shareUrl
    lmSessionId
    shareVideo
    expiresAt
    session {
      startTimestamp
      endTimestamp
      duration
      name
      address
      elevation
      temperature
      humidity
      location
      normalizedElevation
      normalizedTemperature
      normalizedBallType
      shots {
        pointId
        lmDrillTargetId
        clubId
        clubColor
        clubCategory
        clubName
        clubType
        timestamp
        isFavorite
        impactUrl
        videoUrl
        clubSpeed
        ballSpeed
        smashFactor
        attackAngle
        clubPath
        launchAngle
        horizontalLaunchAngle
        faceAngle
        spinRate
        spinAxis
        carryDistance
        totalDistance
        side
        sideTotal
        apex
        descentAngle
        dynamicLoft
        clubSpeedValid
        ballSpeedValid
        smashFactorValid
        attackAngleValid
        clubPathValid
        launchAngleValid
        horizontalLaunchAngleValid
        faceAngleValid
        spinRateValid
        spinAxisValid
        carryDistanceValid
        totalDistanceValid
        sideValid
        sideTotalValid
        apexValid
        descentAngleValid
        dynamicLoftValid
        xFit
        yFit
        zFit
        normalizedValues {
          carryDistance
          totalDistance
          side
          sideTotal
          apex
          distanceToPin
        }
        shotQuality
        targetDistance
        distanceToPin
      }
    }
  }
}
`;

export function extractShareId(inputStr: string): string {
  if (!inputStr || typeof inputStr !== 'string') {
    throw new Error('Please provide a valid Full Swing URL or Session ID.');
  }
  const trimmed = inputStr.trim();
  const uuidMatch = trimmed.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  if (uuidMatch) {
    return uuidMatch[0].toLowerCase();
  }
  throw new Error('Invalid Full Swing share URL or Session ID format. Expected a UUID (e.g. 5c6af3dc-9e48-412b-a041-a41726b25956).');
}

interface CognitoCredentials {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
}

async function getCognitoCredentials(): Promise<CognitoCredentials> {
  const cognitoUrl = `https://cognito-identity.${AWS_REGION}.amazonaws.com/`;

  // 1. Get Identity ID
  const getIdRes = await fetch(cognitoUrl, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityService.GetId',
      'Content-Type': 'application/x-amz-json-1.1',
      'User-Agent': 'FullSwingToSwingSync/1.0',
    },
    body: JSON.stringify({ IdentityPoolId: IDENTITY_POOL_ID }),
  });

  if (!getIdRes.ok) {
    const errorText = await getIdRes.text();
    throw new Error(`Cognito GetId failed: ${errorText}`);
  }

  const idData = (await getIdRes.json()) as { IdentityId?: string };
  const identityId = idData.IdentityId;
  if (!identityId) {
    throw new Error('Failed to retrieve IdentityId from Cognito.');
  }

  // 2. Get Credentials for Identity
  const getCredsRes = await fetch(cognitoUrl, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityService.GetCredentialsForIdentity',
      'Content-Type': 'application/x-amz-json-1.1',
      'User-Agent': 'FullSwingToSwingSync/1.0',
    },
    body: JSON.stringify({ IdentityId: identityId }),
  });

  if (!getCredsRes.ok) {
    const errorText = await getCredsRes.text();
    throw new Error(`Cognito GetCredentialsForIdentity failed: ${errorText}`);
  }

  const credsData = (await getCredsRes.json()) as {
    Credentials?: {
      AccessKeyId: string;
      SecretKey: string;
      SessionToken: string;
    };
  };

  const creds = credsData.Credentials;
  if (!creds || !creds.AccessKeyId || !creds.SecretKey || !creds.SessionToken) {
    throw new Error('Failed to get temporary AWS credentials from Cognito.');
  }

  return {
    accessKey: creds.AccessKeyId,
    secretKey: creds.SecretKey,
    sessionToken: creds.SessionToken,
  };
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
  const kDate = hmacSha256('AWS4' + key, dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, 'aws4_request');
}

export async function fetchFullSwingData(shareIdOrUrl: string): Promise<FullSwingShareData> {
  const shareId = extractShareId(shareIdOrUrl);
  const creds = await getCognitoCredentials();

  const service = 'appsync';
  const body = JSON.stringify({
    query: GRAPHQL_QUERY,
    variables: {
      shareUrl: shareId,
    },
  });

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const canonicalUri = '/graphql';
  const canonicalQuerystring = '';
  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${APPSYNC_HOST}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-security-token:${creds.sessionToken}\n`;
  const signedHeaders = 'content-type;host;x-amz-date;x-amz-security-token';
  const payloadHash = sha256Hex(body);

  const canonicalRequest = `POST\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${AWS_REGION}/${service}/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256Hex(canonicalRequest)}`;

  const signingKey = getSignatureKey(creds.secretKey, dateStamp, AWS_REGION, service);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex');

  const authorizationHeader = `${algorithm} Credential=${creds.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(APPSYNC_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: APPSYNC_HOST,
      'x-amz-date': amzDate,
      'x-amz-security-token': creds.sessionToken,
      Authorization: authorizationHeader,
      'User-Agent': 'FullSwingToSwingSync/1.0',
    },
    body,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AppSync request failed (status ${response.status}): ${errText}`);
  }

  const json = (await response.json()) as {
    data?: { getLmShareSession?: FullSwingShareData };
    errors?: Array<{ message: string }>;
  };

  if (json.errors && json.errors.length > 0) {
    throw new Error(`AppSync error: ${json.errors.map((e) => e.message).join(', ')}`);
  }

  const shareData = json.data?.getLmShareSession;
  if (!shareData || !shareData.session) {
    throw new Error('No session data found for this share link. The session may have expired or does not exist.');
  }

  return shareData;
}
