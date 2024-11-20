export abstract class IAccessTokenGenerator {
  abstract generate(userId: string): Promise<string>;
  abstract decode(token: string): Promise<any>;
}
