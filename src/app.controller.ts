import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getHello() {
        return { message: 'hello world !' };
    }
}