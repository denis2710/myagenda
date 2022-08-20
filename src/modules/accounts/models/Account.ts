import {v4 as uuidV4} from 'uuid';
import {generateAccountToken} from "../shared/utils/generateAccountToken";
import {compareSync, hashSync} from "bcryptjs";

interface ICreateAccount {
  id?: string;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
}

class Account {

  id: string;
  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;

  constructor({
                id = undefined,
                username,
                email,
                password = undefined,
                createdAt = undefined,
                updatedAt = undefined,
                active = true
              }: ICreateAccount) {

    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.active = active;

    if (!id) {
      this.id = uuidV4();
    }
  }

  _password?: string;

  public get password() {
    return this._password;
  }

  public set password(password: string) {
    if (password) {
      this._password = this.getPasswordHash(password);
    }
  }

  public comparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  public getPasswordHash(password: string): string {
    return hashSync(password, 8);
  }

  public generateToken(): string {
    return generateAccountToken(this);
  }


}

export default Account;
