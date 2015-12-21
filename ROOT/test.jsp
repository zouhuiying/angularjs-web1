aaaa:<%=request.getParameter("hao")%>
<%
if(true){
 out.println("helloworld");
}
%>
<%
request.setAttribute("username","xxxxusername");
%>
<%String aa=(String)request.getAttribute("username");%>
<%
 out.println(aa);
%>

