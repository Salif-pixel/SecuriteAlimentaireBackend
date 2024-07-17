import { Global, Module } from '@nestjs/common';
import { SocketService } from './SocketService';

@Global()
@Module({
    imports: [],
  controllers: [],
    providers: [SocketService],
    exports: [SocketService]
})
export class SocketModule {}