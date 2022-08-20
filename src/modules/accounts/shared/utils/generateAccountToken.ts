import Account from "../../models/Account";
import {sign} from "jsonwebtoken";


export const generateAccountToken = (account: Account): string => {

  return sign({}, process.env.JWT_KEY, {
    subject: account.id,
    expiresIn: '1d',
  })
}
