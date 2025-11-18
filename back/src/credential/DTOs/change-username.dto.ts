import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateCredentialDto } from "./create-credential.dto";

export class ChangeUsernameDto extends PartialType(
  OmitType(CreateCredentialDto, ['password', 'confirmPassword'] as const)
) {}