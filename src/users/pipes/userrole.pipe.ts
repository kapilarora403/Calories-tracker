import {ArgumentMetadata, BadRequestException, PipeTransform} from "@nestjs/common";
import {UserRole} from "../dto/authCredentials.dto";

export class UserRoleValidationPipe implements PipeTransform {

    readonly allowedRoles = [UserRole.REGULAR, UserRole.ADMIN, UserRole.USER_MANAGER];

    private isRoleValid(role: any) {
        const index = this.allowedRoles.indexOf(role);
        return index !== -1;
    }
    transform(value: any, metadata: ArgumentMetadata) {
        if(!this.isRoleValid(value)) {
            throw new BadRequestException('Entered role is incorrect');
        }
        return value;
    }
}
