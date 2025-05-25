import { Global, Module } from '@nestjs/common';
import { MiddlewareService } from './middleware.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Global()
@Module({
    imports: [AuthModule, UserModule],
    providers: [MiddlewareService],
    exports: [MiddlewareService],
})
export class MiddlewareModule {}
