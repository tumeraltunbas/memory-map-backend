import * as jwt from 'jsonwebtoken';
import { AuthToken, TokenPayload } from '../models/entities/token';
import configuration from '../config/configuration';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const { hashRounds } = configuration().security;

    const salt = await bcrypt.genSalt(hashRounds);
    return await bcrypt.hash(password, salt);
}

export function generateToken(
    payload: TokenPayload,
    expiresIn: number,
): string {
    const { secretKey, issuer, audience } = configuration().security.jwt;

    const options: jwt.SignOptions = {
        expiresIn,
        issuer,
        audience,
    };

    return jwt.sign(payload, secretKey, options);
}

export function generateAuthTokens(payload: TokenPayload): AuthToken {
    const { accessTokenExpiresIn, refreshTokenExpiresIn } =
        configuration().security.jwt;

    const accessToken: string = generateToken(payload, accessTokenExpiresIn);
    const refreshToken: string = generateToken(payload, refreshTokenExpiresIn);

    const authToken: AuthToken = {
        accessToken,
        refreshToken,
    };

    return authToken;
}

export async function comparePasswords(
    password: string,
    hash: string,
): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export function verifyToken(token: string): TokenPayload {
    const { secretKey, issuer, audience } = configuration().security.jwt;
    const payload = jwt.verify(token, secretKey, { issuer, audience });

    return payload as TokenPayload;
}
