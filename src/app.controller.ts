import { Controller } from "@nestjs/common";

@Controller()
export class AppController {


    @Get("/")
    public gethome() {
        return "your app is working"

    }

}