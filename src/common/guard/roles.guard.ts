import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if(!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // return matchRoles(roles, user.roles);
        return true; 
        // check with false will return response
        //  {
        //     "statusCode": 403,
        //     "message": "Forbidden resource",
        //     "error": "Forbidden"
        //   }
    }
}