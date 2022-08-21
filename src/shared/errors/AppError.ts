interface IAppErrorOptionalParams {
  id?: string,
  type?: string,
  subType?: string,
  title?: string,
  description?: string,
  helpText?: string
}

export class AppError {
  public readonly __typename: string
  public readonly message: string;
  public readonly statusCode: number;
  public readonly id: string;
  public readonly type: string | undefined;
  public readonly  subType: string | undefined;
  public readonly title: string | undefined;
  public readonly description: string | undefined;
  public readonly helpText: string | undefined;

  constructor(message: string,  statusCode = 400, { id, type, subType, title, description, helpText}:  IAppErrorOptionalParams = {}) {
    this.__typename = 'Error';
    this.message = message;
    this.statusCode = statusCode;

    this.id = id || new Date().getTime().toString();
    this.type = type;
    this.subType = subType;
    this.title = title;
    this.description = description;
    this.helpText = helpText;
  }


}
