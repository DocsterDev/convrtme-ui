/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare module 'stompjs';
declare module 'sockjs-client';
// declare module 'ng2-stomp-service';
