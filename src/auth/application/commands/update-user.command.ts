export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
