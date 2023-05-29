export default class Err {
  public name: string | null = "CustomError"
  public stack: string | null = null
  constructor(
    public status: number,
    public message: string,
    public where: string | null = null,
    public identifire: string | null = null
  ) {
    this.stack = new Error(this.message).stack ?? null
    if (process.env.ENVIRNOMENT === "production") {
      this.where = null
      this.identifire = null
      this.name = null
      this.stack = null
    }
  }
}

type A = typeof Err
