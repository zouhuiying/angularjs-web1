<%String yidd=request.getParameter("username");%>
<%
out.print(yidd);
%>

set session:<%request.getSession().setAttribute("yid",yidd);%>
<%String y=(String)request.getSession().getAttribute("yid");%>
<%
out.println(y);
%>
<%String passwordd=(String)request.getSession().getAttribute("password");%>
<%
out.println(passwordd);
%>
<%
response.sendRedirect("http://192.168.139.215:8080/demo/#/drag"+"?mid="+passwordd+"&yid="+y);
%>
