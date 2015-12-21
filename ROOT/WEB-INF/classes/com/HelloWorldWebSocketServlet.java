package com;  
import java.io.DataInputStream;  
import java.io.IOException;  
import java.io.PrintWriter;  
import java.net.Socket;  
import java.net.UnknownHostException;  
import java.nio.ByteBuffer;  
import java.nio.CharBuffer;  
import java.util.ArrayList;  
import java.util.HashMap;
import java.util.Map;
  
import javax.servlet.http.HttpServletRequest;  
  
import org.apache.catalina.websocket.MessageInbound;  
import org.apache.catalina.websocket.StreamInbound;  
import org.apache.catalina.websocket.WebSocketServlet;  
import org.apache.catalina.websocket.WsOutbound;  
  
public class HelloWorldWebSocketServlet extends WebSocketServlet {  
    int id=1;
    //private static ArrayList mmiList  = new ArrayList();  
 //   private static Map mymap  = new HashMap();  
    Map<String,StreamInbound> mymap=new HashMap<String,StreamInbound>();  
 
    protected StreamInbound createWebSocketInbound(String subProtocol,  
            HttpServletRequest arg1) {  
	System.out.println("http1-----"+arg1.getParameter("mid"));
	System.out.println("http2-----"+arg1.getParameter("yid"));
	String mid=arg1.getParameter("mid");
	String yid=arg1.getParameter("yid");
        return new MyMessageInbound(mid,yid);  
    }  
  
    private class MyMessageInbound extends MessageInbound {  
        WsOutbound myoutbound;  
	private String myid;
	private String yourid;
 	public MyMessageInbound(String myid,String yourid) {
		this.myid=myid;
		this.yourid=yourid;
	}
        @Override  
        public void onOpen(WsOutbound outbound) {  
            try {  
                System.out.println("Open Client.");  
                this.myoutbound = outbound;  
              //  mmiList .add(this);  
                mymap.put(myid,this);
                id++;
                outbound.writeTextMessage(CharBuffer.wrap("Hello welcome to!"));  
            } catch (IOException e) {  
                e.printStackTrace();  
            }  
        }  
  
        @Override  
        public void onClose(int status) {  
            System.out.println("Close Client.");  
            //mmiList .remove(this);  
        }  
  
        @Override  
        protected void onBinaryMessage(ByteBuffer arg0) throws IOException {  
            // TODO Auto-generated method stub  
  
        }  
  
        @Override  
        protected void onTextMessage(CharBuffer message) throws IOException {  
            // TODO Auto-generated method stub  
            System.out.println("onText--->" + message.toString());  
           // for (int i=0;i< mmiList.size();i++ ) {  
           //     MyMessageInbound mmib = (MyMessageInbound) mmiList.get(i);  
           //     CharBuffer buffer = CharBuffer.wrap(message);  
           //     mmib.myoutbound.writeTextMessage(buffer);  
           //     mmib.myoutbound.flush();  
           // }  
            //if (mymap.id==1){
                MyMessageInbound mmib=(MyMessageInbound) mymap.get(this.yourid);
                System.out.println(this.yourid);
                CharBuffer buffer = CharBuffer.wrap(message);
                mmib.myoutbound.writeTextMessage(buffer);  
                mmib.myoutbound.flush(); 
           // }
              
        }  
    }  
}
