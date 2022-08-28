import {v4 as uuidV4} from 'uuid';
import {generateAccountToken} from "../shared/utils/generateAccountToken";
import {compareSync, hashSync} from "bcryptjs";

interface ICreateAccount {
  /**
   * The unique id of the account.
   * if not provided, a random one will be generated.
   * @type {string}
   * @memberof ICreateAccount
   * @example '5e8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8'
   *
   */
  id?: string;

  /**
   * The username of the account.
   * @type {string}
   * @memberof ICreateAccount
   * @example 'username'
   */
  username: string;

  /**
   * The email of the account.
   * @type {string}
   * @required
   * @memberof ICreateAccount
   * @example 'example@email.com'
   */
  email: string;

  /**
   * The password of the account.
   * It will be hashed before being stored.
   * @type {string}
   * @required
   * @memberof ICreateAccount
   * @example 'password'
   */
  password: string;

  /**
   * The creation date of the account.
   * if not provided, the current date will be used.
   * @type {Date}
   * @memberof ICreateAccount
   * @example new Date()
   * @default new Date()
   */
  createdAt?: Date;

  /**
   * The last update date of the account.
   * if not provided, the  current date will be used.
   * @type {Date}
   * @memberof ICreateAccount
   * @example new Date()
   * @default new Date()
   */
  updatedAt?: Date;

  /**
   * The status of the account.
   * status can be  true = 'active' or false = 'inactive'.
   * @type {boolean}
   * @memberof ICreateAccount
   * @example true
   * @default true
   * @example false
   */
  active?: boolean;
}

class Account {

  /**
   * The unique id of the account.
   * if not provided, a random one will be generated.
   * @type {string}
   * @memberof Account
   * @example '5e8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8'
   * @readonly
   */
  id: string;

  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
  private _password: string;

  constructor({
                id = undefined,
                username,
                email,
                password,
                createdAt = undefined,
                updatedAt = undefined,
                active = true
              }: ICreateAccount) {


    this.id = this.getId(id);
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.active = active;
  }


  //region getters and setters
  public get password() {
    return this._password;
  }

  public set password(password: string) {
    this._password = this.getPasswordHash(password);
  }
  //endregion

  //region public methods
  public comparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  public getPasswordHash(password: string): string {
    return hashSync(password, 8);
  }

  public generateToken(): string {
    return generateAccountToken(this);
  }

  //endregion

  //region private methods

  /**
   * get the UUID of the account. It will be generated only one time by account.
   * @param value string | undefined
   * @private
   */
  private getId(value: string | undefined): string {
    // please do not remove this next line until we refactor all the file tutupon.js
    if (!value) {
      return  uuidV4();
    } else {
      return value;
    }
  }
  //endregion

}

export default Account;
