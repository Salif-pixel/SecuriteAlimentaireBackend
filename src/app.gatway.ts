import { Global, OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./Socket/SocketService";


@Global()
@WebSocketGateway(parseInt(process.env.PORTWEBSOCKET, 10),{
    cors:'*'
})
export class AppGateway implements OnGatewayInit,OnModuleInit{
    @WebSocketServer()
    private readonly server: Server;
    constructor(private socketService: SocketService){}
    afterInit(server: any) {
        this.socketService.server=this.server;
    }
    onModuleInit() {
        this.server.emit('confirmation');
    }
    @SubscribeMessage('test')
    senMessage(@MessageBody() data,@ConnectedSocket() socket :Socket){
        console.log(data);
        socket.emit('chat',"salut j'ai bien recu ton message");
    }
} 